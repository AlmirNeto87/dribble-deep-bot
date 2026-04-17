import {
  SPOTLIGHT_TEAMS,
  SPOTLIGHT_PLAYERS,
  ICONIC_MOMENTS,
  type TeamCard,
  type Player,
  type FinalsMoment,
} from "@/data/nbaKnowledge";

export type BotResponse = {
  intro: string;
  body: string;
  bullets?: string[];
  data?: { title: string; stats: { label: string; value: string; highlight?: "orange" | "cyan" | "amber" }[] };
  followUp?: string;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function findTeam(q: string): TeamCard | undefined {
  const n = norm(q);
  return SPOTLIGHT_TEAMS.find(
    (t) =>
      n.includes(norm(t.name)) ||
      n.includes(t.abbr.toLowerCase()) ||
      n.includes(norm(t.name.split(" ").slice(-1)[0])),
  );
}

function findPlayer(q: string): Player | undefined {
  const n = norm(q);
  return SPOTLIGHT_PLAYERS.find((p) => {
    const pn = norm(p.name);
    const last = norm(p.name.split(" ").slice(-1)[0]);
    const first = norm(p.name.split(" ")[0]);
    return n.includes(pn) || n.includes(last) || (first.length > 3 && n.includes(first));
  });
}

function findMoment(q: string): FinalsMoment | undefined {
  const n = norm(q);
  const yearMatch = n.match(/(19|20)\d{2}/);
  if (yearMatch) {
    const y = parseInt(yearMatch[0], 10);
    return ICONIC_MOMENTS.find((m) => m.year === y);
  }
  return ICONIC_MOMENTS.find(
    (m) => n.includes(norm(m.fmvp)) || n.includes(norm(m.champion)),
  );
}

function teamResponse(t: TeamCard): BotResponse {
  return {
    intro: `Time em foco: ${t.name}`,
    body: `${t.name} (${t.abbr}) — Conferência ${t.conference === "East" ? "Leste" : "Oeste"}. ${t.funFact}`,
    bullets: [
      `Títulos NBA: ${t.championships}`,
      `Último título: ${t.lastTitle}`,
      `Estrelas atuais: ${t.stars.join(", ")}`,
    ],
    data: {
      title: `${t.abbr} // Histórico`,
      stats: [
        { label: "Anéis", value: String(t.championships), highlight: "orange" },
        { label: "Último", value: String(t.lastTitle), highlight: "cyan" },
        { label: "Conf.", value: t.conference === "East" ? "L" : "O" },
      ],
    },
    followUp: "Quer comparar com outro time ou ver um jogador específico?",
  };
}

function playerResponse(p: Player): BotResponse {
  return {
    intro: `Scout report: ${p.name}`,
    body: `${p.name} — ${p.position}, ${p.team}. Um dos pilares ofensivos da liga atual.`,
    bullets: p.highlights,
    data: {
      title: `${p.name.split(" ").slice(-1)[0]} // Médias`,
      stats: p.stats,
    },
    followUp: "Quer um comparativo com outro jogador?",
  };
}

function momentResponse(m: FinalsMoment): BotResponse {
  return {
    intro: `Finais ${m.year}: ${m.matchup}`,
    body: m.story,
    bullets: [`Campeão: ${m.champion}`, `MVP das Finais: ${m.fmvp}`],
    followUp: "Quer ver outra final histórica?",
  };
}

const FALLBACK: BotResponse = {
  intro: "Análise em andamento",
  body: "Sou especializado em NBA Finals, times, jogadores e momentos históricos. Tente perguntar sobre os Celtics, Jokić, as Finais de 2016 ou compare dois times.",
  bullets: [
    "Exemplo: 'Quem é Luka Dončić?'",
    "Exemplo: 'Conte sobre os Warriors'",
    "Exemplo: 'O que aconteceu nas Finais de 1998?'",
  ],
};

const GREETING: BotResponse = {
  intro: "Sistema online",
  body: "Bem-vindo ao terminal de análise NBA. Posso comentar elencos, estatísticas avançadas e momentos icônicos da liga. Por onde quer começar?",
  bullets: [
    "🏆 Análise das Finais 2024 (Celtics vs Mavericks)",
    "🎯 Scout de jogador (Jokić, Tatum, Luka, LeBron, Curry)",
    "📜 Momentos históricos (1980, 1998, 2016, 2023)",
  ],
};

const FINALS_OVERVIEW: BotResponse = {
  intro: "Finais NBA — Visão executiva",
  body: "As Finais da NBA decidem o campeão entre os vencedores das Conferências Leste e Oeste em uma série melhor de 7. A última edição (2024) coroou o Boston Celtics com seu 18º título, empatando com os Lakers como maior franquia da história.",
  bullets: [
    "Formato 2-2-1-1-1 com vantagem para a melhor campanha da temporada regular",
    "MVP das Finais 2024: Jaylen Brown (Boston)",
    "MVP da Temporada 2023-24: Nikola Jokić (3º troféu)",
  ],
  data: {
    title: "Finais 2024 // Boston em números",
    stats: [
      { label: "Off Rtg", value: "118.4", highlight: "orange" },
      { label: "Def Rtg", value: "108.7", highlight: "cyan" },
      { label: "3P%", value: "38.8", highlight: "amber" },
    ],
  },
  followUp: "Quer detalhes do elenco campeão ou de um jogador específico?",
};

export function generateResponse(input: string): BotResponse {
  const n = norm(input.trim());
  if (!n) return FALLBACK;

  if (/^(oi|ola|hello|hi|e ai|salve|bom dia|boa noite|boa tarde)/.test(n)) {
    return GREETING;
  }

  if (/(final|finais|titulo|campeonato|playoffs?)/.test(n) && !findMoment(input) && !findTeam(input)) {
    return FINALS_OVERVIEW;
  }

  const player = findPlayer(input);
  if (player) return playerResponse(player);

  const team = findTeam(input);
  if (team) return teamResponse(team);

  const moment = findMoment(input);
  if (moment) return momentResponse(moment);

  if (/(mvp)/.test(n)) {
    return {
      intro: "Tracker de MVP",
      body: "MVPs recentes da temporada regular: Nikola Jokić venceu em 2021, 2022 e 2024. Joel Embiid levou em 2023. Para as Finais, Jaylen Brown foi o FMVP de 2024.",
      bullets: [
        "MVP 2024: Nikola Jokić (Denver)",
        "FMVP 2024: Jaylen Brown (Boston)",
        "FMVP 2023: Nikola Jokić (Denver)",
      ],
    };
  }

  return FALLBACK;
}

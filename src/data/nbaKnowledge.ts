// Knowledge base for NBA chatbot — focuses on NBA Finals, teams, players, and iconic moments.
// All info is curated/static (no external API). Bot matches keywords to return rich answers.

export type StatLine = { label: string; value: string; highlight?: "orange" | "cyan" | "amber" };
export type TeamCard = {
  abbr: string;
  name: string;
  conference: "East" | "West";
  championships: number;
  lastTitle: number;
  stars: string[];
  funFact: string;
};

export const SPOTLIGHT_TEAMS: TeamCard[] = [
  {
    abbr: "BOS",
    name: "Boston Celtics",
    conference: "East",
    championships: 18,
    lastTitle: 2024,
    stars: ["Jayson Tatum", "Jaylen Brown", "Kristaps Porzingis"],
    funFact: "Maior campeã da história da NBA, empatada com os Lakers em 18 títulos.",
  },
  {
    abbr: "DAL",
    name: "Dallas Mavericks",
    conference: "West",
    championships: 1,
    lastTitle: 2011,
    stars: ["Luka Dončić", "Kyrie Irving", "P.J. Washington"],
    funFact: "Vice-campeã em 2024. Luka teve média de 28.4 pts/8.0 rebs/7.5 asts nas Finais.",
  },
  {
    abbr: "DEN",
    name: "Denver Nuggets",
    conference: "West",
    championships: 1,
    lastTitle: 2023,
    stars: ["Nikola Jokić", "Jamal Murray", "Aaron Gordon"],
    funFact: "Jokić venceu o MVP das Finais 2023 com triplo-duplo médio na série.",
  },
  {
    abbr: "GSW",
    name: "Golden State Warriors",
    conference: "West",
    championships: 7,
    lastTitle: 2022,
    stars: ["Stephen Curry", "Draymond Green", "Klay Thompson*"],
    funFact: "Dinastia moderna: 4 títulos em 8 anos (2015–2022).",
  },
  {
    abbr: "LAL",
    name: "Los Angeles Lakers",
    conference: "West",
    championships: 17,
    lastTitle: 2020,
    stars: ["LeBron James", "Anthony Davis", "Austin Reaves"],
    funFact: "LeBron foi MVP das Finais em 2020 — seu 4º anel em 4 finais distintas.",
  },
];

export type Player = {
  name: string;
  team: string;
  position: string;
  stats: StatLine[];
  highlights: string[];
};

export const SPOTLIGHT_PLAYERS: Player[] = [
  {
    name: "Nikola Jokić",
    team: "Denver Nuggets",
    position: "C",
    stats: [
      { label: "PPG", value: "29.6", highlight: "orange" },
      { label: "RPG", value: "12.4" },
      { label: "APG", value: "10.2", highlight: "cyan" },
    ],
    highlights: [
      "3x MVP da temporada regular (2021, 2022, 2024)",
      "MVP das Finais 2023",
      "Único jogador na história com mais de 700 ast e 700 reb em uma temporada",
    ],
  },
  {
    name: "Jayson Tatum",
    team: "Boston Celtics",
    position: "SF",
    stats: [
      { label: "PPG", value: "26.9", highlight: "orange" },
      { label: "RPG", value: "8.1" },
      { label: "APG", value: "4.9", highlight: "cyan" },
    ],
    highlights: [
      "Campeão NBA 2024",
      "5x All-Star (2020–2024)",
      "Líder do Boston em pontos nos playoffs de 2024",
    ],
  },
  {
    name: "Luka Dončić",
    team: "Dallas Mavericks",
    position: "PG/SG",
    stats: [
      { label: "PPG", value: "33.9", highlight: "orange" },
      { label: "RPG", value: "9.2" },
      { label: "APG", value: "9.8", highlight: "cyan" },
    ],
    highlights: [
      "Líder de pontuação NBA 2023-24",
      "Vice-campeão em 2024 contra Boston",
      "5 triplos-duplos nas Finais 2024",
    ],
  },
  {
    name: "LeBron James",
    team: "Los Angeles Lakers",
    position: "SF",
    stats: [
      { label: "PPG", value: "25.7", highlight: "orange" },
      { label: "RPG", value: "7.3" },
      { label: "APG", value: "8.3", highlight: "cyan" },
    ],
    highlights: [
      "4x campeão NBA / 4x MVP das Finais",
      "Maior pontuador da história (40,000+ pts)",
      "20x All-Star — recorde absoluto",
    ],
  },
  {
    name: "Stephen Curry",
    team: "Golden State Warriors",
    position: "PG",
    stats: [
      { label: "PPG", value: "26.4", highlight: "orange" },
      { label: "3PM", value: "4.8", highlight: "amber" },
      { label: "APG", value: "5.1", highlight: "cyan" },
    ],
    highlights: [
      "4x campeão NBA, MVP das Finais 2022",
      "Líder histórico em bolas de 3 pontos convertidas",
      "Único MVP unânime da NBA (2015-16)",
    ],
  },
];

export type FinalsMoment = {
  year: number;
  matchup: string;
  champion: string;
  fmvp: string;
  story: string;
};

export const ICONIC_MOMENTS: FinalsMoment[] = [
  {
    year: 2024,
    matchup: "Celtics vs. Mavericks",
    champion: "Boston Celtics (4-1)",
    fmvp: "Jaylen Brown",
    story: "Boston conquistou seu 18º título, recolocando-se como maior franquia da liga, empatado com os Lakers.",
  },
  {
    year: 2023,
    matchup: "Nuggets vs. Heat",
    champion: "Denver Nuggets (4-1)",
    fmvp: "Nikola Jokić",
    story: "Denver venceu o primeiro título de sua história. Jokić: 30 pts / 14 rebs / 7 asts médios na série.",
  },
  {
    year: 2016,
    matchup: "Cavaliers vs. Warriors",
    champion: "Cleveland Cavaliers (4-3)",
    fmvp: "LeBron James",
    story: "A virada histórica de 1-3 contra os Warriors de 73 vitórias. O bloco de LeBron sobre Iguodala virou lenda.",
  },
  {
    year: 1998,
    matchup: "Bulls vs. Jazz",
    champion: "Chicago Bulls (4-2)",
    fmvp: "Michael Jordan",
    story: "'The Last Shot': Jordan acerta o jumper do título sobre Bryon Russell, fechando o segundo three-peat.",
  },
  {
    year: 1980,
    matchup: "Lakers vs. 76ers",
    champion: "Los Angeles Lakers (4-2)",
    fmvp: "Magic Johnson",
    story: "Magic, calouro de 20 anos, jogou de pivô no Jogo 6 e fez 42 pts, 15 rebs e 7 asts. Mítico.",
  },
];

export const SERIES_STATS: StatLine[] = [
  { label: "Off Rtg", value: "118.4", highlight: "orange" },
  { label: "Def Rtg", value: "108.7", highlight: "cyan" },
  { label: "Pace", value: "98.5" },
  { label: "TS%", value: "58.2", highlight: "amber" },
  { label: "AST/TO", value: "2.14" },
  { label: "REB%", value: "52.8" },
];

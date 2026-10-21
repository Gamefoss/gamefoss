export const VIDEO_RULES = {
  excludeAtOrBelowDurationSeconds: 180,
  excludedVideoIds: [
    // Podcast episodes are already available in the dedicated Podcast section.
    's8R_2-PvI4U', // EP #17 - Speedrun
    '44auvKyXkSc', // EP #16 - Tecnologia, Games e Sociedade
    'zcmwDTbRjnQ', // EP #15 - História dos Videogames 2
    'xFNhmIXeedc', // EP #14 - Games educativos x Gamificação
    'TXszQpHZHcM', // EP #13 - Curso de Game Design
    'aKVdT9myd1c', // EP #12 - A História e Legado dos Adventure Games
    'ryDDZKVEBx0', // EP #11 - Devs do Big Festival
    'c6W28w1WUWU', // EP #10 - História dos games #1
    'm2sDZDSqMZU', // EP #09 - Pride Month e Jogos
    'pZlMt1jFK_w', // EP #08 - Entrevista Coffenauts
    'sgoclWhbfLQ', // EP #07 - TCCs e Desgraças
    'ath8lGAWaP4', // EP #06 - Jogos e mercado de trabalho
    'S6MjAnwtA2Q', // EP #05 - Princípios do Game Design
    'AtWtrsIqwxA', // EP #04 - Entrevista GAMEADS
    'hF7Hopll-9M', // EP #03 - Princípios do Game Design: O que é jogo?
    'W5_s7IbUMSY', // EP #02 - Videogames e Violência
    'gp7eGzVXCiA', // EP #01 - Singleplayer vs Multiplayer
    'QZ_gWjCqSVc', // EP #00 - Piloto
  ],
} as const;

export type VideoRules = {
  excludeAtOrBelowDurationSeconds: number;
  excludedVideoIds: readonly string[];
};

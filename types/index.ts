export type PropsItemHorarioAtendimento = {
  id: string;
  hora: string;
  isAlmoco: boolean;
  isCafe: boolean;
};

export type PropsItemHorarioAgendados = {
  id: string;
  data: string;
  hora: string;
  isAlmoco: boolean;
  isCafe: boolean;
  cliente: string;
  pago: boolean;
  active: boolean;
};

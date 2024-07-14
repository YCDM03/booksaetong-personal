export type FormState = {
  email: string;
  password: string;
  nickname: string;
  address: string;
};

export type LoginUser = {
  email: string;
  id: string;
  nickname: string;
  address: string;
  profile_url: string | null;
};

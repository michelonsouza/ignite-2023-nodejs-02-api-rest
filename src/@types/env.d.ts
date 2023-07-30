type BooleanType = 'true' | 'false';

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      LOGGER: BooleanType;
    }
  }
}

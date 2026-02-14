declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    VDO_SECRET_KEY: string;
}
export declare function validate(config: Record<string, any>): EnvironmentVariables;
export {};

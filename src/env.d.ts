declare let process: {
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    NG_APP_ENV: string;
    // Replace the line below with your environment variable for better type checking
    // eslint-disable-next-line @typescript-eslint/member-ordering
    [key: string]: any;
  };
};

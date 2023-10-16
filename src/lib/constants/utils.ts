interface EnvVariables {
  siteName: string;
  baseUrl: string;
  twitter: {
    creator: string;
    site: string;
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}

function validateEnvironmentVariables(): EnvVariables {
  // TODO: validate environment variables
  /*
  const requiredEnvironmentVariables = [
    "NEXT_PUBLIC_TWITTER_CREATOR",
    "NEXT_PUBLIC_TWITTER_SITE",
    "NEXT_PUBLIC_SITE_NAME",
    "NEXT_PUBLIC_BASE_URL",
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_STORAGE_BUCKET",
    "FIREBASE_MESSAGING_ID",
    "FIREBASE_APP_ID",
    "FIREBASE_MEASUREMENT_ID",
  ];
  const missingEnvironmentVariables = [] as string[];

  const keys = Object.keys(process.env);
  requiredEnvironmentVariables.forEach((envVar) => {
    if (!keys.includes(envVar)) {
      console.log(envVar, " in env");
      missingEnvironmentVariables.push(envVar);
    } else {
      console.log(envVar, " not in env");
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them.\n\n${missingEnvironmentVariables.join(
        "\n"
      )}\n`
    );
  }
    */

  return {
    siteName: process.env.SITE_NAME!,
    baseUrl: process.env.BASE_URL!,
    twitter: {
      creator: process.env.TWITTER_CREATOR!,
      site: process.env.TWITTER_SITE!,
    },
    firebase: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
    },
  };
}

export const envVars = validateEnvironmentVariables();

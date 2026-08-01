import { Metadata } from "next";
import StaticPageLayout from "../../components/layouts/StaticPageLayout";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What DevTyp.i.ng collects, where it is stored, and how to request deletion.",
};

export default function Privacy() {
  return (
    <StaticPageLayout title="Privacy">
      <p>
        This page describes what DevTyp.i.ng collects and stores. We keep
        this to a minimum. You do not need an account to use the typing
        practice itself. You need an account only to contribute exercises
        or to vote.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        Signing in with GitHub
      </h2>
      <p>
        Sign-in uses Firebase Authentication with GitHub as the provider. It
        requests only the <code>read:user</code> scope. We store your
        GitHub username and the user ID that Firebase generates. We do not
        request or store your email address, avatar, or any other GitHub
        profile data.
      </p>
      <p>
        Firebase Authentication stores your signed-in session in your
        browser storage (IndexedDB), not in cookies. We do not use cookies
        for tracking or analytics.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        What we store, and where
      </h2>
      <p>
        We store account records in Firestore, a Google cloud database.
        Account records include your GitHub username, your user ID, and
        your account status (active or admin). We also store any exercises
        that you contribute in Firestore.
      </p>
      <p>
        Exercise upvote and downvote counts are anonymous totals. We do not
        record who voted on an exercise.
      </p>
      <p>
        Your browser also caches exercise and topic content in IndexedDB.
        This makes repeat visits faster. This cache stays on your device. We
        cannot see it.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        Analytics and third parties
      </h2>
      <p>
        We use Google Analytics to measure overall site usage, such as page
        visits and traffic volume. We do not use it to build a profile of
        an individual user. Firebase Authentication and GitHub&apos;s OAuth
        flow handle sign-in. We never see your GitHub password.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        Deletion requests
      </h2>
      <p>
        The app does not yet have a self-service way to delete your
        account. To request deletion of your account and any exercises you
        contributed, email{" "}
        <a href="mailto:97@iamlearn.i.ng" className="underline">
          97@iamlearn.i.ng
        </a>
        . We will action your request.
      </p>

      <h2 className="font-mono text-xl font-semibold pt-2">
        Nigeria Data Protection Act context
      </h2>
      <p>
        DevTyp.i.ng uses a <code>.i.ng</code> domain (Nigeria). We follow
        the principles of Nigeria&apos;s Data Protection Act 2023 and the
        General Application and Implementation Directive (GAID) 2025. We
        collect only what the site needs. We store only what the site
        needs. We honour deletion requests. This page is a disclosure of
        our practice, not a formal legal filing. For compliance questions,
        email us at the address above.
      </p>
    </StaticPageLayout>
  );
}

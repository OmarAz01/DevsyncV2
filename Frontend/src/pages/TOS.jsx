import React from "react";

const TOS = () => {
  return (
    <div className="flex flex-col justify-center text-center items-center mb-12 mt-8">
      <h1 className="sm:text-4xl text-2xl font-Roboto text-secondary border-b px-4 font-bold">
        Terms of Use
      </h1>
      <p className="text-gray-400 mt-2 text-sm font-Roboto px-4">
        Last updated: August 26, 2024{" "}
      </p>
      <div className="flex flex-col w-full items-start max-w-4xl text-start mt-4 sm:mt-12">
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4">
          Acceptance of Terms
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          By creating an account or using devsync.org, you agree to comply with
          and be bound by these Terms and Conditions.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Use of Site
        </h2>
        <h3 className="sm:text-xl font-Roboto font-bold w-fit text-secondary px-4 pt-2">
          - Eligibility:
        </h3>
        <p className="text-gray-400 font-Roboto pt-1 pl-8 pr-4">
          You represent and warrant that you are at least 18 years of age or
          visiting the Site under the supervision of a parent or guardian.
        </p>
        <h3 className="sm:text-xl font-Roboto font-bold w-fit text-secondary px-4 pt-2">
          - Account Security:
        </h3>
        <p className="text-gray-400 font-Roboto pt-1 pl-8 pr-4">
          You are responsible for maintaining the confidentiality of your
          account and password and for restricting access to your computer.
          Please notify us immediately if you believe your account has been
          compromised.
        </p>
        <h3 className="sm:text-xl font-Roboto font-bold w-fit text-secondary px-4 pt-2">
          - User Content:
        </h3>
        <p className="text-gray-400 font-Roboto pt-1 pl-8 pr-4">
          You are responsible for any content you post or share on the site. You
          agree not to post content that is illegal, offensive, defamatory, or
          otherwise violates the rights of others.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Termination
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          We reserve the right to terminate your account or restrict access to
          the site at our discretion, without notice or liability.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Limiitation of Liability
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          Devsync.org is provided "as is" and "as available" without any
          warranties of any kind. We do not guarantee that the site will be
          error-free, secure, or uninterrupted. In no event shall devsync.org be
          liable for any damages arising from the use or inability to use the
          site.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Changes to Terms
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          We reserve the right to update or modify these Terms and Conditions at
          any time. Your continued use of the site after any changes indicates
          your acceptance of the updated terms.
        </p>
      </div>
    </div>
  );
};

export default TOS;

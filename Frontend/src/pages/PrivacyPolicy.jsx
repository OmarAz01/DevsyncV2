import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col justify-center text-center items-center mb-12 mt-8">
      <h1 className="sm:text-4xl text-2xl font-Roboto text-secondary border-b px-4 font-bold">
        Privacy Policy
      </h1>
      <p className="text-gray-400 mt-2 text-sm font-Roboto px-4">
        Last updated: August 26, 2024{" "}
      </p>
      <div className="flex flex-col w-full items-start max-w-4xl text-start mt-4 sm:mt-12">
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4">
          Introduction
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          Your privacy is important to us. It is devsync's policy to respect
          your privacy regarding any information we may collect from you across
          our website,{" "}
          <a href="https://www.devsync.org">https://www.devsync.org</a>, and
          other sites we own and operate.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Information we collect
        </h2>
        <h3 className="sm:text-xl font-Roboto font-bold w-fit text-secondary px-4 pt-2">
          - Personal Information:
        </h3>
        <p className="text-gray-400 font-Roboto pr-4 pl-8 pt-1">
          When you sign up, we collect your email address, username, and any
          other information you provide in your profile details.
        </p>
        <h3 className="sm:text-xl font-Roboto font-bold w-fit text-secondary px-4 pt-2">
          - Cookies:
        </h3>
        <p className="text-gray-400 font-Roboto pr-4 pl-8 pt-1">
          We use cookies to store your JWT (JSON Web Token) and username to
          manage your session and improve your experience on our site.
        </p>
        <h3 className="sm:text-xl font-Roboto font-bold w-fit text-secondary px-4 pt-2">
          - Posts and Sync Messages:
        </h3>
        <p className="text-gray-400 font-Roboto pr-4 pl-8 pt-1">
          We collect and store your post content and sync messages you create to
          display on your profile and the feed.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          How we use your information
        </h2>
        <p className="text-secondary font-Roboto pt-1 px-4">
          We use the information we collect in various ways, including to:
        </p>
        <ul className="text-gray-400 font-Roboto list-disc pl-8 pt-1">
          <li>
            Manage your account, process posts and messages, and improve our
            services.
          </li>
          <li>
            We may use your email address to send you updates or notifications
            related to your account or our services.
          </li>
        </ul>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Data Security
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission over the internet or
          electronic storage is completely secure, so we cannot guarantee
          absolute security.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Data Retention
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          We retain your personal information for as long as necessary to
          provide our services and comply with legal obligations. You can
          request the deletion of your account and personal information by
          visiting your profile and accessing the settings tab.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Third Parties
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          We do not share your personal information with third parties unless
          required for legal reasons or to provide our services. We may use
          third-party services to help us operate our platform and provide
          services to our users.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Privacy Policy Changes
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          We may update our privacy policy from time to time. We will notify you
          of any changes by posting the new privacy policy on this page.
        </p>
        <h2 className="sm:text-2xl text-xl font-Roboto font-bold text-primary px-4 pt-4">
          Contact Us
        </h2>
        <p className="text-gray-400 font-Roboto pt-1 px-4">
          If you have any questions or concerns about our privacy policy, please
          contact us at{" "}
          <a href="mailto:support@devsync.org">support@devsync.org</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

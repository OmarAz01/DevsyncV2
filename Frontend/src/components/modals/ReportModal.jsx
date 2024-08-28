import React, { useState } from "react";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import { useCookies } from "react-cookie";
import axios from "axios";

export const ReportModal = ({
  turnOffReportModal,
  createAlert,
  reportedUser,
}) => {
  const [cookie] = useCookies(["token", "username"]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [reportDetails, setReportDetails] = useState({
    reportedUser: reportedUser,
  });

  const handleReport = () => {
    if (reportDetails.reportedUser === cookie.username) {
      createAlert("You cannot report yourself", "error");
      return;
    }
    if (reportDetails.reason === "") {
      createAlert("Reason cannot be empty", "error");
      return;
    }
    const profanityMatcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    if (profanityMatcher.hasMatch(reportDetails.reason)) {
      createAlert("Reason contains profanity", "error");
      return;
    }
    axios
      .post(BASE_URL + "/api/user/report", reportDetails, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((response) => {
        createAlert("User reported", "success");
        turnOffReportModal();
      })
      .catch((error) => {
        if (error.response.status === 403) {
          createAlert("You must be logged in to report", "error");
        } else if (error.response.status === 404) {
          createAlert("User not found", "error");
        } else if (error.response.status === 409) {
          createAlert("User already reported", "error");
        } else if (error.response.status === 500) {
          createAlert("Internal server error", "error");
        } else {
          createAlert("An error occurred", "error");
        }
        turnOffReportModal();
        console.log(error);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-4/5 sm:w-[600px] max-h-[90vh] overflow-y-auto bg-background border-2 border-primary shadow-xl shadow-black rounded-3xl">
          <div className="px-2 pt-2 sm:px-8 sm:pt-8">
            <div className="flex flex-col">
              <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
                Report {reportedUser}
              </h1>
              <div className="flex-col flex justify-start w-full p-2 md:p-4 items-start">
                <div className="flex flex-col items-start w-full">
                  <textarea
                    name="reason"
                    id="reason"
                    className="w-full border mt-2 resize-none border-neutral-400 rounded-md p-2 bg-neutral-900 text-secondary font-Roboto"
                    placeholder="*Reason for report"
                    value={reportDetails.reason}
                    onChange={(e) =>
                      setReportDetails({
                        ...reportDetails,
                        reason: e.target.value,
                      })
                    }
                    rows={9}
                    maxLength={250}
                  ></textarea>
                </div>
                <div className="flex flex-row items-center justify-center my-4 space-x-4 w-full">
                  <button
                    onClick={handleReport}
                    className="bg-green-500 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                  >
                    Report
                  </button>
                  <button
                    onClick={() => turnOffReportModal()}
                    className="bg-red-600 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportModal;

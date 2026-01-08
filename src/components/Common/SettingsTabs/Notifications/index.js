import React, { useEffect, useState } from "react";
import Img from "react-image";
import { useHistory } from "react-router-dom";

import showNotification from "config/Notification";
import "./style.scss";
import ShowLoadingMessage from "config/ShowLoadingMessage";
import { useLazyQuery, useMutation } from "react-apollo";
import AccountQueries from "config/queries/account";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

const NotificationSettings = (props) => {
  const history = useHistory()
  history.listen((location, action) => {
    if (updateNotification) {
      setTimeout(() => {
        updateNotificationPreferences("save");
      }, 400);
    }
  });

  const [notificationPreferences, setNotificationPreferences] = useState([
    {
      appointment: { email: true, whatsApp: true, sms: true },
      taskReminder: { email: true, whatsApp: true, sms: true },
      screeningReport: { email: true, whatsApp: true, sms: true },
      newsLetter: { email: true, whatsApp: true, sms: true }
    }
  ]);
  const [updateNotification, setUpdateNotification] = useState(false)

  const [appointment, setAppointment] = useState({ email: true, whatsApp: true, sms: true });
  const [screeningReport, setscreeningReport] = useState({ email: true, whatsApp: true, sms: true });
  const [newsLetter, setnewsLetter] = useState({ email: true, whatsApp: true, sms: true });
  const [taskReminder, settaskReminder] = useState({ email: true, whatsApp: true, sms: true });

  const [saveNotificationPreferences] = useMutation(AccountQueries.setNotificationPreferences, {
    onCompleted: ({ updateNotificationInhtmlFormation }) => {
      if (updateNotificationInhtmlFormation.success) {
        showNotification(
          "success",
          "Preferences Updated!",
          "Notification Preferences have been updated!"
        );
        setUpdateNotification(false)
        // fetchPreferences()
      } else {
        showNotification(
          "error",
          "An error occured",
          updateNotificationInhtmlFormation.message
        );
        setUpdateNotification(false)
      }
    },
    onError: ({ graphQLErrors, networkError }) => {
      // showNotification(
      //   "error",
      //   "An error occured",
      //   ''
      // )
      console.error(graphQLErrors)

    }
  })

  const [fetchPreferences] = useLazyQuery(AccountQueries.fetchNotificationPreferences, {
    onCompleted: ({ notifications }) => {
      // console.log("preferences", notifications)
      if (!isEmpty(notifications) &&
        get(notifications, "success")
      ) {
        setNotificationPreferences([notifications.data])
        setAppointment(notifications.data.appointment);
        setscreeningReport(notifications.data.screeningReport);
        setnewsLetter(notifications.data.newsLetter);
        settaskReminder(notifications.data.taskReminder);
      } else {
        showNotification(
          "error",
          "An error occured",
          notifications.message
        );
      }
    },
    onError: (error) => showNotification(
      "error",
      "An error occured",
      ""
    )
  });

  const updateNotificationPreferences = async (type, preferences) => {

    if (type === "set") {
      notificationPreferences.forEach((n, i) => {
        if (n[preferences.type]) {
          n[preferences.type][preferences.name] =
            preferences.event.target.checked;
        }
      });

      setUpdateNotification(true);
    }

    if (type === "save") {
      let r = {};

      if (updateNotification) {
        ShowLoadingMessage("Saving Your Changes...");

        setUpdateNotification(false);

        notificationPreferences.forEach((t, i) => {
          Object.keys(t).forEach((l, j) => {
            r[l] = { ...t[l] };
          });
        });

        saveNotificationPreferences({ variables: r })
      }
    }
  };

  useEffect(() => {
    fetchPreferences()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="notify">
      <div className="">
        <div className="row">
          <div className="col-xl-6">
            <div className="notify_settings d-flex">
              <Img
                src={[
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification1.webp",
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification1.png"
                ]}
                alt="img"
              />
              <div className="details">
                <h4>New Enquiry, Application /Order &amp; Appointment</h4>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={appointment["email"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "email",
                        type: "appointment"
                      })
                    }
                    className="custom-control-input"
                    id="switch1"
                  />
                  <label className="custom-control-label" htmlFor="switch1">
                    {" "}
                    Email
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={appointment["sms"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "sms",
                        type: "appointment"
                      })
                    }
                    className="custom-control-input"
                    id="switch2"
                  />
                  <label className="custom-control-label" htmlFor="switch2">
                    {" "}
                    SMS
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={appointment["whatsApp"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "whatsApp",
                        type: "appointment"
                      })
                    }
                    className="custom-control-input"
                    id="switch3"
                  />
                  <label className="custom-control-label" htmlFor="switch3">
                    {" "}
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="notify_settings d-flex">
              <Img
                src={[
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification2.webp",
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification2.png"
                ]}
                alt="img"
              />
              <div className="details">
                <h4>Background check & screening report</h4>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={screeningReport["email"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "email",
                        type: "screeningReport"
                      })
                    }
                    className="custom-control-input"
                    id="switch4"
                  />
                  <label className="custom-control-label" htmlFor="switch4">
                    {" "}
                    Email
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={screeningReport["sms"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "sms",
                        type: "screeningReport"
                      })
                    }
                    className="custom-control-input"
                    id="switch5"
                  />
                  <label className="custom-control-label" htmlFor="switch5">
                    {" "}
                    SMS
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    name="whatsApp"
                    type="checkbox"
                    checked={screeningReport["whatsApp"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "whatsApp",
                        type: "screeningReport"
                      })
                    }
                    className="custom-control-input"
                    id="switch6"
                  />
                  <label className="custom-control-label" htmlFor="switch6">
                    {" "}
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="notify_settings d-flex">
              <Img
                src={[
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification3.webp",
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification3.png"
                ]}
                alt="img"
              />
              <div className="details">
                <h4>New offers and Newsletter</h4>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={newsLetter["email"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "email",
                        type: "newsLetter"
                      })
                    }
                    className="custom-control-input"
                    id="switch7"
                  />
                  <label className="custom-control-label" htmlFor="switch7">
                    {" "}
                    Email
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={newsLetter["sms"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "sms",
                        type: "newsLetter"
                      })
                    }
                    className="custom-control-input"
                    id="switch8"
                  />
                  <label className="custom-control-label" htmlFor="switch8">
                    {" "}
                    SMS
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={newsLetter["whatsApp"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "whatsApp",
                        type: "newsLetter"
                      })
                    }
                    className="custom-control-input"
                    id="switch9"
                  />
                  <label className="custom-control-label" htmlFor="switch9">
                    {" "}
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="notify_settings d-flex">
              <Img
                src={[
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification4.webp",
                  "https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification4.png"
                ]}
                alt="img"
              />
              <div className="details">
                <h4>Task reminder, Appointments & payments</h4>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={taskReminder["email"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "email",
                        type: "taskReminder"
                      })
                    }
                    className="custom-control-input"
                    id="switch10"
                  />
                  <label className="custom-control-label" htmlFor="switch10">
                    {" "}
                    Email
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={taskReminder["sms"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "sms",
                        type: "taskReminder"
                      })
                    }
                    className="custom-control-input"
                    id="switch11"
                  />
                  <label className="custom-control-label" htmlFor="switch11">
                    {" "}
                    SMS
                  </label>
                </div>
                <div className="custom-control custom-switch custom-control-inline">
                  <input
                    type="checkbox"
                    checked={taskReminder["whatsApp"]}
                    onChange={event =>
                      updateNotificationPreferences("set", {
                        event,
                        name: "whatsApp",
                        type: "taskReminder"
                      })
                    }
                    className="custom-control-input"
                    id="switch12"
                  />
                  <label className="custom-control-label" htmlFor="switch12">
                    {" "}
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

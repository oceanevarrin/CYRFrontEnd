import React, { useState } from "react";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { thunkContactUs } from "../../store/messages/actions";
import translate from '../../i18n/translate';

interface Props {
  thunkContactUs: any;
  locale:string;
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Footer = ({ thunkContactUs, locale }: Props) => {
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const { email, message } = formData;

  const handleSuccessClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

  const handleErrorClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorOpen(false);
  };

  const onChange = (event: any) => {
    let e = event.target;
    setFormData({ ...formData, [e.name]: e.value });
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    thunkContactUs({ email, message }).then((s: boolean) => {
      if (s) {
        setSuccessOpen(true);
        setFormData({
          email: "",
          message: "",
        });
      } else {
        setErrorOpen(true);
      }
    });
  };
  return (
    //Footer
    <div>
      <footer id="footer" className="footer-1" style={{marginTop:'6%'}}>
        <div className="main-footer widgets-dark typo-light">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6">
                <div className="widget subscribe no-box">
                  <h5 className="widget-title">
                    Claim Your Rights<span></span>
                  </h5>
                  <p>
                    {translate("footer description")}
                  </p>
                  <h5 className="widget-title" style={{marginTop:'15%'}}>
                    {translate("Quick Links")}<span></span>
                  </h5>
                  <ul>
                    <li><a href='/#/about-us'>{translate("aboutus title")}</a></li>
                    <li><a href='/#/terms-of-services'>{translate("terms of services")}</a></li>
                    <li><a href='/#/news'>{translate("News")}</a></li>
                  </ul>
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-md-6">
                <div className="widget no-box">
                  <h5 className="widget-title">
                    {translate("Contact Us")}<span></span>
                  </h5>
                  <div
                    className="f_widget company_widget wow fadeInLeft"
                    data-wow-delay="0.2s"
                    style={{
                      visibility: "visible",
                      animationDelay: "0.2s",
                      animationName: "fadeInLeft",
                    }}
                  >
                    <h3 className="f-title f_600 t_color f_size_18">
                      {translate("Get in Touch")}
                    </h3>
                    <p>{translate("Ask questions and Don’t miss any updates!")}</p>
                    <form
                      action="/"
                      className="f_subscribe_two mailchimp"
                      method="post"
                      onSubmit={onSubmit}
                    >
                      <input
                        type="text"
                        required
                        className="form-control memail"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={onChange}
                      />
                      <br />
                      <textarea
                        required
                        className="form-control memail"
                        placeholder={locale === 'de-de' ? 'Nachricht' : 'Message'}
                        name="message"
                        value={message}
                        onChange={onChange}
                      />
                      <br />
                      <button className="btn btn-primary" type="submit">
                        {translate("Send Message")}
                      </button>

                      <p
                        className="mchimp-errmessage"
                        style={{ display: "none" }}
                      ></p>
                      <p
                        className="mchimp-sucmessage"
                        style={{ display: "none" }}
                      ></p>
                    </form>
                  </div>
                  <br />
                  <ul className="social-footer2">
                    <li className="">
                      <a
                        href="https://www.linkedin.com/company/claimyourrights"
                        className="fa fa-linkedin"
                        style={{ color: "white" }}
                      ><span style={{visibility:'hidden'}}>Linkden</span></a>
                    </li>
                    <li className="">
                      <a
                        href="https://m.facebook.com/claimyourrightsch-101078294964442/"
                        className="fa fa-facebook"
                        style={{ color: "white" }}
                      ><span style={{visibility:'hidden'}}>Facebook</span></a>
                    </li>
                    <li className="">
                      <a
                        href="https://twitter.com/CYR_Switzerland"
                        className="fa fa-twitter"
                        style={{ color: "white" }}
                      ><span style={{visibility:'hidden'}}>Twitter</span></a>
                    </li>
                    <li className="">
                      <a
                        href="https://www.instagram.com/claimyourrights/?hl=fr"
                        className="fa fa-instagram"
                        style={{ color: "white" }}
                      ><span style={{visibility:'hidden'}}>Instagram</span></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <p>
                  Copyright ClaimYourRights © {new Date().getFullYear()}. All
                  rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Snackbar
          open={successOpen}
          autoHideDuration={3000}
          onClose={handleSuccessClose}
        >
          <Alert onClose={handleSuccessClose} severity="success">
            Messege sent successfully!
          </Alert>
        </Snackbar>
        <Snackbar
          open={errorOpen}
          autoHideDuration={3000}
          onClose={handleErrorClose}
        >
          <Alert onClose={handleErrorClose} severity="error">
            Error while sending message, please try again!
          </Alert>
        </Snackbar>
      </footer>
    </div>
  );
};

export default connect(null, { thunkContactUs })(Footer);

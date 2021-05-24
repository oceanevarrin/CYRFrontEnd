import React from "react";
import { Cdivider } from "../../utils/Custum";
import translate from '../../i18n/translate';

const Detail = () => {
  return (
    <div>
      <div className="bg-light">
        <div className="container py-5">
          <div className="row h-100 align-items-center py-5">
            <div className="col-lg-6">
              <h1 className="display-4">{translate("aboutus title")}</h1>
              <Cdivider />
              <p className="font-italic text-muted mb-4">
                {translate("aboutus detail")}
              </p>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834136/illus_kftyh4.png"
                alt=""
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <i className="fa fa-bar-chart fa-2x mb-3 text-primary"></i>
              <h2 className="font-weight-light">{translate("moto title")}</h2>
              <Cdivider />
              <h4 className="font-weight-light">{translate("quality")}</h4>
              <p className="font-italic text-muted mb-4">
                {translate("quality description")}
              </p>
              <h4 className="font-weight-light">{translate("win win")}</h4>
              <p className="font-italic text-muted mb-4">
                {translate("winwin description")}
              </p>
            </div>
            <div className="col-lg-5 px-5 mx-auto order-1 order-lg-2">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834139/img-1_e25nvh.jpg"
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-5 px-5 mx-auto">
              <img
                src="https://res.cloudinary.com/mhmd/image/upload/v1556834136/img-2_vdgqgn.jpg"
                alt=""
                className="img-fluid mb-4 mb-lg-0"
              />
            </div>
            <div className="col-lg-6">
              <i className="fa fa-leaf fa-2x mb-3 text-primary"></i>
              <h4 className="font-weight-light">{translate("facility")}</h4>
              <p className="font-italic text-muted mb-4">
                {translate("facility description")}
              </p>
              <h4 className="font-weight-light">{translate("security")}</h4>
              <p className="font-italic text-muted mb-4">
                {translate("security description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;

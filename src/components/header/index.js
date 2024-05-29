import React from "react";
import style from "./header.module.scss";

function Header({ onClick, saveTrigger }) {
  return (
    <>
      <div className={style.container}>
        <div className={style.heading}>Bitespeed</div>
        <div>
          <button className={style.button} onClick={onClick}>
            {saveTrigger ? "Saving" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;

import React from "react";

interface IProps {
  onClick: () => void;
  title: string;
}

const Button: React.FC<IProps> = (props) => {
  return <button onClick={props.onClick}>{props.title}</button>;
};

export default Button;

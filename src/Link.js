import { Link } from "inferno-router";

export default props => (
  <Link {...props} to={
    process.env.PUBLIC_URL + (props.to.startsWith("/") ? props.to : "/" + props.to)
  }>
    {props.children}
  </Link>
);

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    // backgroundColor: "#000000"
    display: "flex"
  },
  label: {
    position: "absolute",
    color: theme.palette.common.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "black"
  },
  svgLabel: {
    fill: theme.palette.common.black,
    fontSize: "1rem",
    textAnchor: "middle",
    transform: "translateY(0.5rem)"
  }
}));

export default useStyles;

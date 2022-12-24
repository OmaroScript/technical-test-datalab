import React from "react";
import { func, string, arrayOf, shape } from "prop-types";
import * as d3 from "d3";
import { Typography } from "@material-ui/core";
import useStyles from "./styles";
import Arc from "./Layouts/Arc";

const arc = d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0) + 3)
  .outerRadius(d => Math.sqrt(d.y1));

const Graph = ({ data, onSelectCategory, selectedCategoryName }) => {
  const classes = useStyles();
  const container = React.useRef(null);
  const svgLabelRef = React.useRef(null);
  const [labelPercent, setLabelPercent] = React.useState("");
  const [labelName, setLabelName] = React.useState("");
  const [titleDescription, setTitleDescription] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [subtitleDescription, setSubtitleDescription] = React.useState("");
  const [isAnimating, setIsAnimating] = React.useState(false);

  const width = 300;
  const height = 300;
  const radius = Math.min(width, height) / 2;

  const rootNodes = React.useMemo(() => {
    if (!radius) return [];
    const partition = d3.partition().size([2 * Math.PI, radius * radius]);
    const rootData = d3
      .hierarchy({ name: "root", children: data })
      .sum(d => (!d.children?.length ? parseFloat(d.percent) : 0))
      .sort((a, b) => parseFloat(b.percent) - parseFloat(a.percent));
    // obtener rootNodes y eliminar el elemento root
    const descendants = partition(rootData)
      .descendants()
      .slice(1);

    return descendants;
  }, [data, radius]);

  const getTargetCoordinats = React.useCallback((node, selectedNode) => {
    if (!selectedNode)
      return { x0: node.x0, x1: node.x1, y0: node.y0, y1: node.y1 };
    const x0 =
      node.depth < 2
        ? node.x0
        : Math.max(
            0,
            Math.min(
              1,
              (node.x0 - selectedNode.x0) / (selectedNode.x1 - selectedNode.x0)
            )
          ) *
          (2 * Math.PI);
    const x1 =
      node.depth < 2
        ? node.x1
        : Math.max(
            0,
            Math.min(
              1,
              (node.x1 - selectedNode.x0) / (selectedNode.x1 - selectedNode.x0)
            )
          ) *
          (2 * Math.PI);
    const y0 = node.depth < 2 ? 0 : node.parent.y0;
    const y1 = node.depth < 2 ? 0 : node.y0;
    return {
      x0,
      x1,
      y0,
      y1
    };
  }, []);

  const getCurrentCoordinates = React.useCallback(node => {
    if (node.current) return node.current;
    return {
      x0: node.x0,
      x1: node.x1,
      y0: node.y0,
      y1: node.y1
    };
  }, []);

  const countAssets = React.useMemo(() => {
    let count = 0;

    data.forEach(item => {
      count += 1;

      if (item.children) {
        count += item.children.length;
      }
    });

    return count;
  }, [data]);

  const onMouseover = d => {
    setLabelPercent(`${d.data.percent}%`);
    setLabelName(d.data.name);
    d3.select(svgLabelRef.current).attr("opacity", d.depth === 1 ? 1 : 0);
  };

  const onMouseout = () => {
    setLabelPercent("");
    setLabelName("");
    d3.select(svgLabelRef.current).attr("opacity", 1);
  };

  const onClick = p => {
    if (!p.children) return;
    setLabelPercent("");
    setLabelName("");
    setTitleDescription(p.data.name);
    setDescription(p.data.body);
    setSubtitle(p.data.children.name);
    setSubtitleDescription(p.data.children.body);
    onSelectCategory(p.data.name === selectedCategoryName ? "" : p.data.name);
  };

  const onCenterClick = () => {
    if (isAnimating) return;
    setLabelPercent("");
    setLabelName("");
    onSelectCategory("");
    setTitleDescription("");
    setDescription("");
    setSubtitle("");
    setSubtitleDescription("");
  };

  React.useEffect(() => {
    const selectedNode = rootNodes.find(
      d => d?.data?.name === selectedCategoryName
    );
    d3.select(container.current)
      .select("svg")
      .select("g")
      .selectAll("path")
      .transition()
      .duration(750)
      .attrTween("d", (d, i) => {
        const node = rootNodes[i];
        const current = getCurrentCoordinates(node);
        const target = getTargetCoordinats(node, selectedNode);

        // Guarde nuevas coordenadas para el próximo uso en la animación.
        node.current = selectedNode ? target : null;

        const interpolator = d3.interpolateObject(current, target);
        return t => arc(interpolator(t));
      })
      .attr("opacity", (d, i) => {
        const node = rootNodes[i];
        if (!selectedNode) {
          return node.depth <= 1 ? 1 : 0.25;
        }
        return node.depth <= 1 ? 0 : 1;
      })
      .attr("visibility", (d, i) => {
        const node = rootNodes[i];
        if (!selectedNode) {
          return;
        }
        return node.depth <= 1 ? "hidden" : "initial";
      })
      .on("start", () => setIsAnimating(true))
      .on("end cancel interrupt", () => setIsAnimating(false));
  }, [
    selectedCategoryName,
    rootNodes,
    getTargetCoordinats,
    getCurrentCoordinates
  ]);

  const labelStyles = {
    top: height / 2 - (radius * 0.8) / 2,
    left: width / 2 - (radius * 0.8) / 2,
    width: 120,
    height: 120,
    transform: `scale(${1})`
  };

  return (
    <div data-testid="Graph" ref={container} className={classes.root}>
      <div style={{width: "50%"}}>
        <svg width={width} height={height}>
          <g transform={`translate(${width / 2},${height / 2})`}>
            <text ref={svgLabelRef} className={classes.svgLabel}>
              {selectedCategoryName}
            </text>
            <circle
              r={(radius / Math.PI) * 2}
              fill="none"
              pointerEvents="all"
              style={{ cursor: selectedCategoryName === "" ? "auto" : "pointer" }}
              onClick={onCenterClick}
            />
            {rootNodes.map(d => (
              <Arc
                key={`${d.data.name}-${d.depth}`}
                onMouseOver={() => onMouseover(d)}
                onMouseOut={onMouseout}
                onClick={() => onClick(d)}
                data={arc(d)}
                cursor={d.depth === 1 ? "pointer" : "auto"}
                fill={d.data.color}
                opacity={d.depth === 1 ? 1 : 0.25}
              />
            ))}
          </g>
        </svg>
        {!labelName && !selectedCategoryName && (
          <div className={classes.label} style={labelStyles}>
            <Typography variant="h4" align="center">
              {countAssets}
            </Typography>
            <Typography variant="h5" align="center">
              assets
            </Typography>
          </div>
        )}
        {!labelName ? null : (
          <div className={classes.label} style={labelStyles}>
            <Typography variant="h4" align="center">
              {labelPercent}
            </Typography>
            <Typography align="center">{labelName}</Typography>
          </div>
        )
        }
      </div>
      <div style={{color: 'black', width: "50%"}}>
        <h1>{titleDescription}</h1>
        {description}
        <h2>{subtitle}</h2>
        {subtitleDescription}
      </div>
    </div>
  );
};

Graph.propTypes = {
  data: arrayOf(
    shape({
      name: string,
      price: string,
      percent: string,
      color: string,
      children: arrayOf(
        shape({
          name: string,
          price: string,
          percent: string
        })
      )
    })
  ),
  onSelectCategory: func.isRequired,
  selectedCategoryName: string.isRequired
};

Graph.defaultProps = {
  data: []
};
export default Graph;

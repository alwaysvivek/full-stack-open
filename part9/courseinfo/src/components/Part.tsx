import { PartProps } from "../types";

const Part = (props: PartProps) => {
  const { unit } = props;
  switch (unit.kind) {
    case "basic":
      return (
        <div>
          <h3>
            {unit.name} {unit.exerciseCount}
          </h3>
          <p>
            <em>{unit.description}</em>
          </p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>
            {unit.name} {unit.exerciseCount}
          </h3>
          <p>project exercises {unit.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>
            {unit.name} {unit.exerciseCount}
          </h3>
          <p>
            <em>{unit.description}</em>
          </p>
          <p>background material: {unit.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>
            {unit.name} {unit.exerciseCount}
          </h3>
          <p>
            <em>{unit.description}</em>
          </p>
          <p>required skills: {unit.requirements.join(", ")}</p>
        </div>
      );
    default:
      return null;
  }
};

export default Part;

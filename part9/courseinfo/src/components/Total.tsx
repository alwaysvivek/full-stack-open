import { TotalProps } from "../types";

const Total = (props: TotalProps) => {
  const { curriculumUnits } = props;
  return (
    <p>
      Number of exercises{" "}
      {curriculumUnits.reduce((carry, unit) => carry + unit.exerciseCount, 0)}
    </p>
  );
};

export default Total;

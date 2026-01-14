import Part from "./Part";
import { ContentProps } from "../types";

const Content = (props: ContentProps) => {
  const { curriculumUnits } = props;
  return (
    <div>
      {curriculumUnits.map((unit, index) => (
        <Part key={index} unit={unit} />
      ))}
    </div>
  );
};

export default Content;

const CourseHeader = ({ title }) => {
  return <h1>{title}</h1>;
};

const CourseBody = ({ curriculum }) => {
  return (
    <div>
      <DataItem item={curriculum[0]} />
      <DataItem item={curriculum[1]} />
      <DataItem item={curriculum[2]} />
    </div>
  );
};

const DataItem = ({ item }) => {
  return (
    <p>
      {item.name} {item.exercises}
    </p>
  );
};

const ExerciseTotal = ({ curriculum }) => {
  const sum = curriculum[0].exercises + curriculum[1].exercises + curriculum[2].exercises;
  return <p>Number of exercises {sum}</p>;
};

const App = () => {
  const courseData = {
    title: "Half Stack application development",
    curriculum: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <CourseHeader title={courseData.title} />
      <CourseBody curriculum={courseData.curriculum} />
      <ExerciseTotal curriculum={courseData.curriculum} />
    </div>
  );
};

export default App;

export interface HeaderProps {
  courseName: string;
}

export interface ContentProps {
  curriculumUnits: CurriculumUnit[];
}

export interface TotalProps {
  curriculumUnits: CurriculumUnit[];
}

export interface PartProps {
  unit: CurriculumUnit;
}

interface CurriculumUnitBase {
  name: string;
  exerciseCount: number;
}

interface CurriculumUnitDescription extends CurriculumUnitBase {
  description: string;
}

interface CurriculumUnitBasic extends CurriculumUnitDescription {
  kind: "basic";
}

interface CurriculumUnitGroup extends CurriculumUnitBase {
  groupProjectCount: number;
  kind: "group";
}

interface CurriculumUnitBackground extends CurriculumUnitDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CurriculumUnitSpecial extends CurriculumUnitDescription {
  requirements: string[];
  kind: "special";
}

export type CurriculumUnit =
  | CurriculumUnitBasic
  | CurriculumUnitGroup
  | CurriculumUnitBackground
  | CurriculumUnitSpecial;

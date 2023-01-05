import { IComponentMaterial } from "core-react";
import { TimePicker } from "expamples/ant5/components/TimePicker";
import { icon } from "./icon";
import { locales, resourceLocales } from "./locales";
import { materialSchema } from "./schema";

const name = "TimePicker"
export const TimePickerMaterial: IComponentMaterial = {
  componentName: name,
  component: TimePicker,
  designer: TimePicker,
  designerLocales: locales,
  designerSchema: materialSchema,
  designerProps: {
  },
  resource: {
    name: name,
    resourceLocales: resourceLocales,
    icon: icon,
    color: "#8B79EC",
    elements: [
      {
        componentName: name,
      }
    ]
  },
}
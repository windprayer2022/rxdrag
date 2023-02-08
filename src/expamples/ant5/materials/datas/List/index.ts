import { IComponentMaterial } from "core-react";
import { List } from "expamples/ant5/components/datas/List";
import { ListFooterMaterial } from "../ListFooter";
import { ListHeaderMaterial } from "../ListHeader";
import { ListItemMaterial } from "../ListItem";
import { icon } from "./icon";
import { locales, resourceLocales } from "./locales";
import { materialSchema } from "./schema";

const name = "List"
export const ListMaterial: IComponentMaterial = {
  componentName: name,
  component: List,
  designer: List,
  designerLocales: locales,
  designerSchema: materialSchema,
  designerProps: {
    dataSource: [{}]
  },
  resource: {
    name: name,
    resourceLocales: resourceLocales,
    icon: icon,
    color: "#8B79EC",
    elements: [
      {
        componentName: name,
        slots: {
          renderItem: {
            componentName: "ListItem",
            children: [
              {
                componentName: "ListItemMeta",
                slots: {
                  avatar: {
                    componentName: "Avatar"
                  },
                  title: {
                    componentName: "TextView",
                    props: {
                      content: "Title"
                    }
                  },
                  description: {
                    componentName: "TextView",
                    props: {
                      content: "Description"
                    }
                  },
                }
              }
            ],
            slots: {
              actions: {
                componentName: "ActionSlot"
              },
              extra: {
                componentName: "ExtraSlot"
              },
            }
          },
        }
      }
    ]
  },
  slots: {
    renderItem: ListItemMaterial,
    header: ListHeaderMaterial,
    footer: ListFooterMaterial,
  },
  behaviorRule: {
    droppable: false,
    noPlaceholder: false,
  }
}
import { ActivityResource } from "@rxdrag/minions-logicflow-editor"
import { IActivityMaterial } from "@rxdrag/minions-schema"
import { DraggableText } from "../DraggableText"
import { ClassMeta } from "@rxdrag/uml-schema"
import { queryEntitiesMaterial } from "../../../../minions/materials/QueryEntities"
import { listIcon } from "@rxdrag/react-shared"

export function getListNode(cls: ClassMeta) {

  return {
    key: cls.uuid + "queryList",
    title: <ActivityResource
      material={queryEntitiesMaterial as IActivityMaterial<React.ReactNode>}
      config={{
        entityId: cls.uuid
      }}
    >
      {
        (onStartDrag) => {
          return <DraggableText onMouseDown={onStartDrag}>
            读取多实体
          </DraggableText>
        }
      }
    </ActivityResource>,
    isLeaf: true,
    icon: listIcon
  }
}
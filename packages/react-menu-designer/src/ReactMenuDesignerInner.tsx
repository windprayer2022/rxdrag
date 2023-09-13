import { memo, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
  DragOverEvent,
  MeasuringStrategy,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
} from '@dnd-kit/sortable';

import {
  buildTree,
  flattenTree,
  getProjection,
  removeChildrenOf,
} from './utilities';
import type { FlattenedItem, TreeItems } from './types';
import styled from 'styled-components';
import { Toolbox } from './components/Toolbox';
import { PropertyPanel } from './components/PropertyPanel';
import { Button, Divider, Space } from 'antd';
import { DeleteOutlined, RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { SortableTree } from './components/SortableTree';
import { MaterialsContext } from './contexts';
import { menuMaterials } from './materials';
import { useActiveIdState } from './hooks/useActiveIdState';
import { useOverIdState } from './hooks/useOverIdState';
import { useOffsetLeftState } from './hooks/useOffsetLeftState';
import { useItemsState } from './hooks/useItemsState';

const Shell = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-flow: column;
  background-color: ${props => props.theme.token?.colorBorderSecondary};
  align-items: center;
  box-sizing: border-box;
  padding: 16px;
`

const CanvasContainer = styled.div`
  flex: 1;
  user-select: none;
  padding: 0;
  max-width: 600px;
  width: 500px;
  box-sizing: border-box;
  background-color: ${props => props.theme.token?.colorBgContainer};
  height: 0;
  display: flex;
  flex-flow: column;
  border-radius: 8px;
  overflow: hidden;
`

const Canvas = styled.div`
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
`

const Toolbar = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: solid 1px ${props => props.theme.token?.colorBorder};
  flex-shrink: 0;
  padding: 0 16px;
  justify-content: space-between;
  background-color: ${props => props.theme.token?.colorBgBase};
`



const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};


interface Props {
  defaultItems?: TreeItems;
  indentationWidth?: number;
  indicator?: boolean;
}

export const ReactMenuDesignerInner = memo(({
  indentationWidth = 50,
}: Props) => {
  const [items, setItems] = useItemsState();
  const [activeId, setActiveId] = useActiveIdState();
  const [overId, setOverId] = useOverIdState();
  const [offsetLeft, setOffsetLeft] = useOffsetLeftState();

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);
  const projected =
    activeId && overId
      ? getProjection(
        flattenedItems,
        activeId,
        overId,
        offsetLeft,
        indentationWidth
      )
      : null;

  return (
    <MaterialsContext.Provider value={menuMaterials}>
      <DndContext
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Shell>
          <Toolbox ></Toolbox>
          <CanvasContainer>
            <Toolbar>
              <Space>
                <Button type="text" icon={<UndoOutlined />} />
                <Button type="text" icon={<RedoOutlined />} />
                <Divider type='vertical' />
                <Button type="text" icon={<DeleteOutlined />} />
              </Space>
              <Button type="primary" >保存</Button>
            </Toolbar>
            <Canvas>
              <SortableTree />
            </Canvas>
          </CanvasContainer>
          <PropertyPanel></PropertyPanel>
        </Shell>
      </DndContext>
    </MaterialsContext.Provider>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);
    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    console.log("===>handleDragMove", delta)
    setOffsetLeft(delta.x);
  }

  function handleDragOver(e: DragOverEvent) {
    console.log("===>handleDragOver", e)
    const { over } = e
    setOverId(over?.id ?? null);
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    resetState();
    console.log("===>handleDragEnd", e)
    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);

    document.body.style.setProperty('cursor', '');
  }

})


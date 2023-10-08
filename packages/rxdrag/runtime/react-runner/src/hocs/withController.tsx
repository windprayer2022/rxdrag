/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactComponent } from "@rxdrag/react-shared"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { ControllerContext } from "../contexts"
import { EventHandlers, IController, IControllerMeta } from "@rxdrag/minions-runtime-react"
import { useControllerEngine } from "../hooks/useControllerEngine"

export function withController(WrappedComponent: ReactComponent, meta: IControllerMeta | undefined): ReactComponent {
  if (!meta?.id || !meta?.enable) {
    return WrappedComponent
  }

  return memo((props: any) => {
    const [changedProps, setChangeProps] = useState<any>()
    const [events, setEvents] = useState<EventHandlers>()
    const [controller, setController] = useState<IController>()
    const controllerEngine = useControllerEngine();

    const handlePropsChange = useCallback((name: string, value: any) => {
      setChangeProps((changedProps: any) => {
        return ({ ...changedProps, [name]: value })
      })
    }, [])

    const handleEventsChange = useCallback((eventHandlers?: EventHandlers) => {
      setEvents(eventHandlers)
    }, [])

    useEffect(() => {
      if (meta?.enable && controllerEngine) {
        const ctrl = controllerEngine.getController(meta.id)
        const unlistener = ctrl?.subscribeToPropsChange(handlePropsChange)
        const unsubEvents = ctrl?.subscribeEventHandlersChange(handleEventsChange)
        ctrl?.initEvent?.()
        setController(ctrl)
        return () => {
          ctrl?.destroyEvent?.()
          ctrl?.destroy()
          unlistener?.()
          unsubEvents?.()
        }
      }
    }, [handlePropsChange, controllerEngine, handleEventsChange])

    const newProps = useMemo(() => {
      return { ...props, ...events, ...changedProps }
    }, [changedProps, events, props]);

    console.log("====>controller events", events)
    return (
      <ControllerContext.Provider value={controller}>
        <WrappedComponent {...newProps} />
      </ControllerContext.Provider>
    )
  })
}

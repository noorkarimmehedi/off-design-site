import * as React from "react"

export function recursiveCloneChildren(
  children: React.ReactElement[],
  sharedProps: any,
  targetNames: string[],
  uniqueId: string,
  asChild?: boolean,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child

    const childType = child.type as any
    const childDisplayName = childType?.displayName || childType?.name

    if (targetNames.includes(childDisplayName)) {
      return React.cloneElement(child, {
        ...sharedProps,
        ...child.props,
        key: child.key || `${childDisplayName}-${uniqueId}`,
      })
    }

    if (child.props?.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: recursiveCloneChildren(
          React.Children.toArray(child.props.children) as React.ReactElement[],
          sharedProps,
          targetNames,
          uniqueId,
          asChild,
        ),
      })
    }

    return child
  })
}

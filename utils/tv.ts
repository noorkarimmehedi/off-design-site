import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ClassNameValue = ClassValue

interface TVConfig {
  slots?: Record<string, ClassNameValue>
  variants?: Record<string, Record<string, ClassNameValue | Record<string, ClassNameValue>>>
  compoundVariants?: Array<{
    [key: string]: any
    class?: ClassNameValue | Record<string, ClassNameValue>
  }>
  defaultVariants?: Record<string, any>
}

export function tv(config: TVConfig) {
  return (props?: Record<string, any>) => {
    const { slots = {}, variants = {}, compoundVariants = [], defaultVariants = {} } = config
    const mergedProps = { ...defaultVariants, ...props }

    const result: Record<string, (options?: { class?: ClassNameValue }) => string> = {}

    // Process each slot
    Object.keys(slots).forEach((slotName) => {
      result[slotName] = (options?: { class?: ClassNameValue }) => {
        const classes = [slots[slotName]]

        // Apply variant classes
        Object.keys(variants).forEach((variantKey) => {
          const variantValue = mergedProps[variantKey]
          if (variantValue && variants[variantKey][variantValue]) {
            const variantClasses = variants[variantKey][variantValue]
            if (typeof variantClasses === "object" && variantClasses[slotName]) {
              classes.push(variantClasses[slotName])
            } else if (typeof variantClasses === "string" && slotName === "root") {
              classes.push(variantClasses)
            }
          }
        })

        // Apply compound variants
        compoundVariants.forEach((compound) => {
          const { class: compoundClass, ...conditions } = compound
          const matches = Object.keys(conditions).every((key) => {
            const condition = conditions[key]
            const propValue = mergedProps[key]
            return Array.isArray(condition) ? condition.includes(propValue) : condition === propValue
          })

          if (matches && compoundClass) {
            if (typeof compoundClass === "object" && compoundClass[slotName]) {
              classes.push(compoundClass[slotName])
            } else if (typeof compoundClass === "string" && slotName === "root") {
              classes.push(compoundClass)
            }
          }
        })

        return cn(...classes, options?.class)
      }
    })

    return result
  }
}

export type VariantProps<T extends (...args: any) => any> = Parameters<T>[0]

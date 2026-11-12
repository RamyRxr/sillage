import { motion, type HTMLMotionProps } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { motionTokens, springs } from '../../lib/motion'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonStyles'

const hover = { y: -2 }
const tap = { scale: motionTokens.scale.subtle }

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({ variant, size, className, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <motion.button
      type={type}
      className={buttonClasses(variant, size, className)}
      whileHover={rest.disabled ? undefined : hover}
      whileTap={rest.disabled ? undefined : tap}
      transition={springs.snappy}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

const MotionLink = motion.create(Link)

type ButtonLinkProps = Omit<ComponentProps<typeof MotionLink>, 'className' | 'children'> & {
  to: LinkProps['to']
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
}

export function ButtonLink({ variant, size, className, children, ...rest }: ButtonLinkProps) {
  return (
    <MotionLink
      className={buttonClasses(variant, size, className)}
      whileHover={hover}
      whileTap={tap}
      transition={springs.snappy}
      {...rest}
    >
      {children}
    </MotionLink>
  )
}

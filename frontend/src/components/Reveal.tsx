import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp } from '@/animations/variants';

/** Section reveal on scroll. Framer's MotionConfig(reducedMotion="user") turns this into a plain fade. */
export function Reveal({ children, delay = 0, ...rest }: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

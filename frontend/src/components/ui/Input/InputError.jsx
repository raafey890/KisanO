import { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { INPUT_ERROR_STATE, INPUT_TRANSITIONS } from './inputVariants';
import { getHelperTextClasses, mergeClasses } from './inputUtils';

/**
 * KisanO Design System — Input Package
 * InputError
 *
 * Accessible, animated error message component for the KisanO Input system.
 * This component is presentation-focused and only renders validation feedback.
 * It supports single or multiple error messages, premium motion, reduced motion,
 * and responsive, production-ready styling.
 *
 * @module components/ui/Input/InputError
 */

const ERROR_CONTAINER_STYLES =
  'mt-1.5 rounded-xl border border-red-100/90 bg-red-50/90 px-3 py-2.5 shadow-[0_10px_24px_rgba(239,68,68,0.10)] backdrop-blur-sm';

const LIST_SPACING_STYLES = Object.freeze({
  single: 'gap-0',
  multiple: 'gap-1.5',
});

const ITEM_VARIANTS = {
  initial: {
    opacity: 0,
    y: 6,
    scale: 0.98,
    filter: 'blur(2px)',
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: reducedMotion
      ? {
          duration: 0.16,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 380,
          damping: 28,
          mass: 0.75,
        },
  }),
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.985,
    filter: 'blur(2px)',
    transition: {
      duration: 0.12,
      ease: 'easeIn',
    },
  },
};

const ICON_VARIANTS = {
  initial: {
    opacity: 0,
    scale: 0.8,
    rotate: -8,
  },
  animate: (reducedMotion) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: reducedMotion
      ? {
          duration: 0.14,
          ease: 'easeOut',
        }
      : {
          type: 'spring',
          stiffness: 420,
          damping: 24,
          mass: 0.6,
        },
  }),
};

/**
 * Normalizes the incoming error content into a clean array of messages.
 *
 * @param {string|string[]|React.ReactNode} message - Error message or list of messages.
 * @returns {Array<string|React.ReactNode>} Normalized message list.
 */
function normalizeMessages(message) {
  if (Array.isArray(message)) {
    return message.filter(Boolean);
  }

  return message ? [message] : [];
}

/**
 * Decorative error icon for validation feedback.
 *
 * @returns {JSX.Element} Error icon.
 */
function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <path
        fillRule="evenodd"
        d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Production-ready animated input error component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string|string[]|React.ReactNode} [props.message] - Error content.
 * @param {React.ReactNode} [props.children] - Alternative error content.
 * @param {string} [props.id] - Optional id for aria-describedby wiring.
 * @param {string} [props.className=''] - Additional container classes.
 * @param {boolean} [props.withIcon=true] - Shows an error icon for each message.
 * @param {boolean} [props.announce=true] - Enables assertive live-region announcements.
 * @returns {JSX.Element|null} Animated error block or null.
 */
const InputError = memo(
  forwardRef(function InputError(
    {
      message,
      children,
      id,
      className = '',
      withIcon = true,
      announce = true,
      ...props
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();
    const resolvedMessage = children ?? message;

    const messages = useMemo(
      () => normalizeMessages(resolvedMessage),
      [resolvedMessage],
    );

    const containerClasses = useMemo(
      () =>
        mergeClasses(
          'w-full',
          ERROR_CONTAINER_STYLES,
          INPUT_TRANSITIONS.default,
          className,
        ),
      [className],
    );

    const listClasses = useMemo(
      () =>
        mergeClasses(
          'flex flex-col',
          messages.length > 1 ? LIST_SPACING_STYLES.multiple : LIST_SPACING_STYLES.single,
        ),
      [messages.length],
    );

    const textClasses = useMemo(
      () =>
        mergeClasses(
          'min-w-0 flex-1 leading-relaxed tracking-[-0.006em]',
          getHelperTextClasses({ status: 'error', className: '' }),
        ),
      [],
    );

    const iconClasses = useMemo(
      () =>
        mergeClasses(
          'mt-0.5 shrink-0',
          INPUT_ERROR_STATE.icon,
          INPUT_TRANSITIONS.colorsOnly,
        ),
      [],
    );

    if (!messages.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        id={id}
        className={containerClasses}
        role={announce ? 'alert' : undefined}
        aria-live={announce ? 'assertive' : undefined}
        aria-atomic={announce ? 'true' : undefined}
        data-state="error"
        {...props}
      >
        <div className={listClasses}>
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((item, index) => (
              <motion.div
                key={`${typeof item === 'string' ? item : 'error-message'}-${index}`}
                custom={prefersReducedMotion}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={ITEM_VARIANTS}
                className="flex items-start gap-2"
              >
                {withIcon ? (
                  <motion.span
                    custom={prefersReducedMotion}
                    initial="initial"
                    animate="animate"
                    variants={ICON_VARIANTS}
                    className={iconClasses}
                  >
                    <ErrorIcon />
                  </motion.span>
                ) : null}

                <div className={textClasses}>{item}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }),
);

InputError.displayName = 'InputError';

InputError.propTypes = {
  /** Error content rendered inside the component. */
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  /** Alternative error content. */
  children: PropTypes.node,
  /** Optional id for aria-describedby linkage. */
  id: PropTypes.string,
  /** Additional container classes. */
  className: PropTypes.string,
  /** Displays a leading error icon for each message. */
  withIcon: PropTypes.bool,
  /** Enables assertive live-region announcements. */
  announce: PropTypes.bool,
};

export default InputError;
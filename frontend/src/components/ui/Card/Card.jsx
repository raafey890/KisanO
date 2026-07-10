/**
 * KisanO Design System — Card Package
 * Card
 *
 * The main Card component that orchestrates all card subcomponents.
 * It provides a convenient slot‑based API for composing card content,
 * and handles loading states, accessibility, and animations.
 *
 * Single Responsibility: Orchestrate the Card subcomponents.
 * It does not contain business logic, helper functions, or duplicate
 * styling logic — everything is delegated to the subcomponents and
 * shared utilities.
 *
 * @module components/ui/Card/Card
 */

import { forwardRef, memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import {
  CARD_DEFAULTS,
  
} from './cardVariants';
import {
  mergeClasses,
  resolveDefaultProps,
  isInteractiveCard,
} from './cardUtils';

import CardContainer from './CardContainer';
import CardHeader from './CardHeader';
import CardMedia from './CardMedia';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardActions from './CardActions';
import CardBadge from './CardBadge';
import CardLoader from './CardLoader';

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

/**
 * Card – the main container for card content with built‑in loading and slots.
 *
 * @component
 * @example
 * <Card variant="elevated" loading={isLoading}>
 *   <CardHeader title="Equipment" subtitle="Available" />
 *   <CardMedia src="/image.jpg" />
 *   <CardBody>
 *     <p>Description of equipment...</p>
 *   </CardBody>
 *   <CardActions>
 *     <Button>Rent</Button>
 *   </CardActions>
 *   <CardBadge color="success">In Stock</CardBadge>
 * </Card>
 *
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Card content (can also use slots).
 * @param {string} [props.variant] - Visual variant (default, outlined, etc.).
 * @param {string} [props.size] - Size preset (xs, sm, md, lg, xl).
 * @param {string} [props.radius] - Border radius override.
 * @param {string} [props.elevation] - Shadow level.
 * @param {string} [props.status] - Status state (default, hover, active, loading, error, success, warning, disabled).
 * @param {boolean} [props.disabled] - Disables interactions and dims content.
 * @param {boolean} [props.loading] - Shows loading skeleton.
 * @param {boolean} [props.interactive] - Whether the card responds to hover/tap.
 * @param {React.ReactNode} [props.header] - Header slot content.
 * @param {React.ReactNode} [props.media] - Media slot content.
 * @param {React.ReactNode} [props.body] - Body slot content.
 * @param {React.ReactNode} [props.footer] - Footer slot content.
 * @param {React.ReactNode} [props.actions] - Actions slot content.
 * @param {React.ReactNode} [props.badge] - Badge slot content.
 * @param {React.ReactNode} [props.loader] - Custom loader (overrides default).
 * @param {Object} [props.headerProps] - Additional props for CardHeader.
 * @param {Object} [props.mediaProps] - Additional props for CardMedia.
 * @param {Object} [props.bodyProps] - Additional props for CardBody.
 * @param {Object} [props.footerProps] - Additional props for CardFooter.
 * @param {Object} [props.actionsProps] - Additional props for CardActions.
 * @param {Object} [props.badgeProps] - Additional props for CardBadge.
 * @param {Object} [props.loaderProps] - Additional props for CardLoader.
 * @param {string} [props.className] - Additional CSS classes for the container.
 * @param {string} [props.role] - ARIA role (default: 'article').
 * @param {string} [props['aria-label']] - Accessible label.
 * @param {React.Ref<HTMLElement>} ref - Forwarded ref.
 * @returns {React.ReactElement} The rendered card.
 */
const Card = memo(
  forwardRef(function Card(
    {
      children,
      variant = CARD_DEFAULTS.variant,
      size = CARD_DEFAULTS.size,
      radius,
      elevation,
      status = CARD_DEFAULTS.status || 'default',
      disabled = CARD_DEFAULTS.disabled || false,
      loading = CARD_DEFAULTS.loading || false,
      interactive = CARD_DEFAULTS.interactive !== undefined ? CARD_DEFAULTS.interactive : true,
      header,
      media,
      body,
      footer,
      actions,
      badge,
      loader,
      headerProps,
      mediaProps,
      bodyProps,
      footerProps,
      actionsProps,
      badgeProps,
      loaderProps,
      className = '',
      role = 'article',
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const prefersReducedMotion = useReducedMotion();

    // Resolve default props using the shared utility.
    const resolved = useMemo(
      () =>
        resolveDefaultProps({
          variant,
          size,
          radius,
          elevation,
          animation: true, // not used here but required by resolveDefaultProps
          interactive,
          loading,
          disabled,
        }),
      [variant, size, radius, elevation, interactive, loading, disabled],
    );

    // Determine if the card is interactive (for accessibility and events).
   
    // Determine whether to show the loader.
    const showLoader = resolved.loading;

    // Base container props.
    const containerProps = {
      variant: resolved.variant,
      size: resolved.size,
      radius: resolved.radius,
      elevation: resolved.elevation,
      status,
      disabled: resolved.disabled,
      loading: resolved.loading,
      interactive: resolved.interactive,
      className,
      role,
      'aria-label': ariaLabel || 'Card',
    };

    // Animation presets for the content area (fade in/out).
    const contentMotion = {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 8 },
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    };

    // If reduced motion is preferred, skip animations.
    const motionProps = useMemo(() => {
      if (prefersReducedMotion) {
        return { initial: false, animate: true, exit: false };
      }
      return contentMotion;
    }, [prefersReducedMotion]);

    // Default loader component if none provided.
    const defaultLoader = useMemo(
      () => (
        <CardLoader
          size={resolved.size}
          variant="shimmer"
          animated={!prefersReducedMotion}
          {...loaderProps}
        />
      ),
      [resolved.size, prefersReducedMotion, loaderProps],
    );

    // Build the content to render (with or without loader).
    const renderContent = useCallback(() => {
      // If children are provided, use them as the primary content.
      // If children exist, we ignore the slot props (header, body, etc.)
      // to allow the user full control. This is a common pattern.
      if (children) {
        return children;
      }

      // Otherwise, render the slot‑based composition.
      return (
        <>
          {badge && (
            <CardBadge
              {...badgeProps}
              
            >
              {badge}
            </CardBadge>
          )}
          {header && <CardHeader {...headerProps}>{header}</CardHeader>}
          {media && <CardMedia {...mediaProps}>{media}</CardMedia>}
          {body && <CardBody {...bodyProps}>{body}</CardBody>}
          {footer && <CardFooter {...footerProps}>{footer}</CardFooter>}
          {actions && <CardActions {...actionsProps}>{actions}</CardActions>}
        </>
      );
    }, [
      children,
      badge,
      badgeProps,
      header,
      headerProps,
      media,
      mediaProps,
      body,
      bodyProps,
      footer,
      footerProps,
      actions,
      actionsProps,
    ]);

    // Combine all container props and ref.
    return (
      <CardContainer
        ref={ref}
        {...containerProps}
        {...rest}
      >
        <AnimatePresence mode="wait" initial={false}>
          {showLoader ? (
            <motion.div
              key="loader"
              {...motionProps}
              className="w-full"
            >
              {loader || defaultLoader}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              {...motionProps}
              className="w-full"
            >
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContainer>
    );
  }),
);

Card.displayName = 'Card';

Card.propTypes = {
  /** Card content (if provided, slot props are ignored). */
  children: PropTypes.node,
  /** Visual variant from CARD_VARIANTS. */
  variant: PropTypes.oneOf([
    'default',
    'outlined',
    'filled',
    'elevated',
    'glass',
    'gradient',
    'success',
    'warning',
    'danger',
    'info',
  ]),
  /** Size preset. */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Border radius override (e.g., 'md', 'xl', 'full'). */
  radius: PropTypes.string,
  /** Shadow level override. */
  elevation: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner']),
  /** Status state (affects background and border). */
  status: PropTypes.oneOf([
    'default',
    'hover',
    'active',
    'loading',
    'error',
    'success',
    'warning',
    'disabled',
  ]),
  /** Disables interactions and dims content. */
  disabled: PropTypes.bool,
  /** Shows loading skeleton. */
  loading: PropTypes.bool,
  /** Whether the card responds to hover/tap effects. */
  interactive: PropTypes.bool,
  /** Header slot. */
  header: PropTypes.node,
  /** Media slot. */
  media: PropTypes.node,
  /** Body slot. */
  body: PropTypes.node,
  /** Footer slot. */
  footer: PropTypes.node,
  /** Actions slot. */
  actions: PropTypes.node,
  /** Badge slot (positioned absolute top‑right). */
  badge: PropTypes.node,
  /** Custom loader (overrides default). */
  loader: PropTypes.node,
  /** Additional props for CardHeader. */
  headerProps: PropTypes.object,
  /** Additional props for CardMedia. */
  mediaProps: PropTypes.object,
  /** Additional props for CardBody. */
  bodyProps: PropTypes.object,
  /** Additional props for CardFooter. */
  footerProps: PropTypes.object,
  /** Additional props for CardActions. */
  actionsProps: PropTypes.object,
  /** Additional props for CardBadge. */
  badgeProps: PropTypes.object,
  /** Additional props for CardLoader. */
  loaderProps: PropTypes.object,
  /** Additional CSS classes for the container. */
  className: PropTypes.string,
  /** ARIA role (default: 'article'). */
  role: PropTypes.string,
  /** Accessible label. */
  'aria-label': PropTypes.string,
};

export default Card;
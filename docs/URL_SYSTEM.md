# Layerium Cloud URL System

Enterprise-grade URL routing system for Layerium Cloud platform.

## Route Structure

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/pricing` | Pricing page |
| `/#features` | Features section |
| `/#locations` | Datacenters section |
| `/#faq` | FAQ section |
| `/contact` | Contact page |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |

### Authentication Routes
| Route | Description |
|-------|-------------|
| `/auth/login` | Login page (unified auth) |
| `/auth/login?mode=signup` | Signup mode |
| `/auth/login?redirect=/path` | Login with redirect |
| `/auth/forgot-password` | Password reset request |
| `/auth/reset-password` | Set new password |
| `/auth/callback` | OAuth callback handler |
| `/auth/logout` | Logout handler |

### Dashboard Routes (Protected)
| Route | Description |
|-------|-------------|
| `/dashboard` | Dashboard overview |
| `/dashboard/servers` | Server list |
| `/dashboard/servers/[id]` | Server details |
| `/dashboard/deploy` | Deploy new server |
| `/dashboard/deploy?plan=vps-standard` | Deploy with plan |
| `/dashboard/billing` | Billing overview |
| `/dashboard/billing?tab=invoices` | Invoices tab |
| `/dashboard/billing?tab=payment` | Payment methods |
| `/dashboard/support` | Support center |
| `/dashboard/settings` | Account settings |

## URL Parameters

### Authentication
- `mode`: `login` | `signup` - Auth mode
- `redirect`: URL to redirect after auth
- `error`: Error message to display
- `message`: Success message to display

### Deploy
- `plan`: Plan ID (e.g., `vps-standard`, `rdp-pro`)
- `type`: `vps` | `rdp` - Server type
- `region`: Region code
- `os`: OS template ID

## Legacy Route Redirects

Old routes automatically redirect to new routes:

| Old Route | New Route |
|-----------|-----------|
| `/login` | `/auth/login` |
| `/signup` | `/auth/login?mode=signup` |
| `/forgot-password` | `/auth/forgot-password` |
| `/reset-password` | `/auth/reset-password` |

## Usage Examples

### Pricing Page → Deploy Flow
```tsx
import { buildPricingActionUrl } from "@/lib/routes";

// Generates: /auth/login?redirect=/dashboard/deploy?plan=vps-standard
const url = buildPricingActionUrl("vps-standard");
```

### Build Auth URL with Redirect
```tsx
import { buildAuthUrl } from "@/lib/routes";

// Login with redirect
const loginUrl = buildAuthUrl("login", { redirect: "/dashboard/servers" });

// Signup with plan selection
const signupUrl = buildAuthUrl("signup", { plan: "rdp-pro" });
```

### Build Deploy URL
```tsx
import { buildDeployUrl } from "@/lib/routes";

// Deploy with plan
const url = buildDeployUrl({ plan: "vps-standard" });

// Deploy with type and region
const url = buildDeployUrl({ type: "vps", region: "us-ny" });
```

## Security

- All redirects are validated to be internal URLs only
- OAuth callbacks verify the redirect destination
- Protected routes require authentication
- Session refresh handled automatically

## Middleware Flow

1. Check for legacy route redirects (301)
2. Check if route is protected
   - If not authenticated → redirect to `/auth/login?redirect=...`
3. Check if route is auth route
   - If authenticated → redirect to dashboard or redirect param
4. Set geo-location cookies for pricing

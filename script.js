/**
 * Enterprise Connectivity Network Background
 * Clean, professional animated network visualization for Zerofive Technologies
 * Represents: Starlink connectivity, network topology, data flow
 * Brand colors: Gold (#FFC107), Dark blue (#0D1B2A), subtle cyan accents
 */
class AnimatedBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: false });
        
        // Core network systems
        this.nodes = [];
        this.dataPulses = [];
        this.satellites = [];
        
        this.animationId = null;
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = performance.now();
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        // Brand colors
        this.colors = {
            gold: { h: 45, s: 100, l: 50 },      // #FFC107
            goldLight: { h: 45, s: 100, l: 65 },
            cyan: { h: 190, s: 80, l: 50 },
            cyanDark: { h: 200, s: 70, l: 35 },
            blue: { h: 210, s: 60, l: 25 }
        };
        
        // Check if user prefers reduced motion
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Check if mobile - simplify for performance
        this.isMobile = window.innerWidth < 768;
        
        this.init();
    }

    init() {
        if (this.isMobile) {
            this.renderStatic();
            return;
        }
        
        this.setupCanvas();
        this.createNetworkNodes();
        this.createSatellites();
        
        if (!this.prefersReducedMotion) {
            this.animate();
            this.setupMouseInteraction();
        } else {
            this.renderStatic();
        }

        // Handle resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 150);
        }, { passive: true });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else if (!this.prefersReducedMotion) {
                this.resume();
            }
        });
    }

    setupMouseInteraction() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });
    }

    setupCanvas() {
        const viewportWidth = window.visualViewport?.width || window.innerWidth;
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        this.canvas.width = viewportWidth * dpr;
        this.canvas.height = viewportHeight * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }

    // Create network nodes representing connectivity points
    createNetworkNodes() {
        const nodeCount = this.isMobile ? 40 : 120;
        this.nodes = [];
        
        // Also create floating particles for ambient atmosphere
        this.particles = [];
        const particleCount = this.isMobile ? 60 : 200;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4 - 0.1,
                size: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                isGold: Math.random() > 0.7
            });
        }
        
        for (let i = 0; i < nodeCount; i++) {
            const isGoldNode = Math.random() > 0.7; // 30% gold nodes (primary/hub nodes)
            
            this.nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                baseX: 0, // Will be set after
                baseY: 0,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: isGoldNode ? Math.random() * 3 + 2.5 : Math.random() * 2 + 1,
                isHub: isGoldNode,
                pulsePhase: Math.random() * Math.PI * 2,
                orbitRadius: Math.random() * 20 + 10,
                orbitSpeed: (Math.random() - 0.5) * 0.008,
                orbitAngle: Math.random() * Math.PI * 2,
                opacity: isGoldNode ? 0.9 : 0.5 + Math.random() * 0.3
            });
        }
        
        // Set base positions
        this.nodes.forEach(node => {
            node.baseX = node.x;
            node.baseY = node.y;
        });
    }
    
    // Create satellite-like elements orbiting at the top
    createSatellites() {
        this.satellites = [];
        const satCount = 3;
        
        for (let i = 0; i < satCount; i++) {
            this.satellites.push({
                angle: (Math.PI * 2 / satCount) * i,
                speed: 0.0003 + Math.random() * 0.0002,
                radiusX: window.innerWidth * 0.4 + Math.random() * 100,
                radiusY: 80 + Math.random() * 40,
                centerY: 120,
                size: 3 + Math.random() * 2,
                trail: []
            });
        }
    }

    animate() {
        const now = performance.now();
        this.deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.time += 0.008;

        this.animationId = requestAnimationFrame(() => this.animate());

        this.drawBackground();
        this.updateAndDrawParticles();
        this.updateAndDrawSatellites();
        this.updateNodes();
        this.drawConnections();
        this.drawNodes();
        this.updateAndDrawDataPulses();
        
        // Occasionally spawn data pulses between connected nodes
        if (Math.random() < 0.015) {
            this.spawnDataPulse();
        }
    }
    
    drawBackground() {
        // Clean gradient background matching brand
        const gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, '#050A12');
        gradient.addColorStop(0.4, '#0D1B2A');
        gradient.addColorStop(0.7, '#0D1B2A');
        gradient.addColorStop(1, '#050A12');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Subtle radial glow in center-top (like satellite coverage)
        const centerGlow = this.ctx.createRadialGradient(
            window.innerWidth / 2, 0, 0,
            window.innerWidth / 2, 0, window.innerHeight * 0.8
        );
        centerGlow.addColorStop(0, 'rgba(255, 193, 7, 0.03)');
        centerGlow.addColorStop(0.3, 'rgba(255, 193, 7, 0.01)');
        centerGlow.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = centerGlow;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    
    // Floating ambient particles for depth and atmosphere
    updateAndDrawParticles() {
        if (!this.particles) return;
        
        this.ctx.save();
        
        this.particles.forEach(p => {
            // Update position with gentle drift
            p.x += p.vx;
            p.y += p.vy;
            p.twinklePhase += p.twinkleSpeed;
            
            // Wrap around edges
            if (p.x < -10) p.x = window.innerWidth + 10;
            if (p.x > window.innerWidth + 10) p.x = -10;
            if (p.y < -10) p.y = window.innerHeight + 10;
            if (p.y > window.innerHeight + 10) p.y = -10;
            
            // Calculate twinkle effect
            const twinkle = Math.sin(p.twinklePhase) * 0.4 + 0.6;
            const alpha = p.opacity * twinkle;
            
            // Draw particle with glow
            if (p.isGold) {
                // Gold particles with subtle glow
                const glow = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
                glow.addColorStop(0, `rgba(255, 193, 7, ${alpha * 0.6})`);
                glow.addColorStop(0.5, `rgba(255, 193, 7, ${alpha * 0.2})`);
                glow.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = glow;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 215, 80, ${alpha})`;
                this.ctx.fill();
            } else {
                // Cyan/white particles
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(180, 220, 240, ${alpha * 0.7})`;
                this.ctx.fill();
            }
        });
        
        this.ctx.restore();
    }
    
    updateAndDrawSatellites() {
        this.ctx.save();
        
        this.satellites.forEach(sat => {
            sat.angle += sat.speed;
            
            const x = window.innerWidth / 2 + Math.cos(sat.angle) * sat.radiusX;
            const y = sat.centerY + Math.sin(sat.angle) * sat.radiusY;
            
            // Add to trail
            sat.trail.push({ x, y, opacity: 1 });
            if (sat.trail.length > 30) sat.trail.shift();
            
            // Draw trail
            sat.trail.forEach((point, i) => {
                const opacity = (i / sat.trail.length) * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 193, 7, ${opacity})`;
                this.ctx.fill();
            });
            
            // Draw satellite node
            const glow = this.ctx.createRadialGradient(x, y, 0, x, y, sat.size * 4);
            glow.addColorStop(0, 'rgba(255, 193, 7, 0.8)');
            glow.addColorStop(0.3, 'rgba(255, 193, 7, 0.3)');
            glow.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(x, y, sat.size * 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, sat.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFC107';
            this.ctx.fill();
            
            // Draw faint connection lines to nearby ground nodes
            this.nodes.slice(0, 5).forEach(node => {
                if (node.isHub) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(node.x, node.y);
                    this.ctx.strokeStyle = 'rgba(255, 193, 7, 0.05)';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        this.ctx.restore();
    }

    updateNodes() {
        this.nodes.forEach(node => {
            // Gentle orbital motion around base position
            node.orbitAngle += node.orbitSpeed;
            
            const orbitX = Math.cos(node.orbitAngle) * node.orbitRadius;
            const orbitY = Math.sin(node.orbitAngle) * node.orbitRadius * 0.5;
            
            // Subtle drift
            node.baseX += node.vx;
            node.baseY += node.vy;
            
            // Bounce off edges gently
            if (node.baseX < 50 || node.baseX > window.innerWidth - 50) node.vx *= -1;
            if (node.baseY < 50 || node.baseY > window.innerHeight - 50) node.vy *= -1;
            
            // Keep in bounds
            node.baseX = Math.max(30, Math.min(window.innerWidth - 30, node.baseX));
            node.baseY = Math.max(30, Math.min(window.innerHeight - 30, node.baseY));
            
            node.x = node.baseX + orbitX;
            node.y = node.baseY + orbitY;
            
            // Subtle mouse influence on nearby nodes
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) / 150 * 0.5;
                node.x += dx * force * 0.02;
                node.y += dy * force * 0.02;
            }
        });
    }

    drawConnections() {
        this.ctx.save();
        
        const maxDist = 180;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeA = this.nodes[i];
                const nodeB = this.nodes[j];
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.3;
                    
                    // Gold connections between hub nodes, cyan for others
                    if (nodeA.isHub && nodeB.isHub) {
                        this.ctx.strokeStyle = `rgba(255, 193, 7, ${opacity * 0.8})`;
                        this.ctx.lineWidth = 1.5;
                    } else if (nodeA.isHub || nodeB.isHub) {
                        this.ctx.strokeStyle = `rgba(255, 193, 7, ${opacity * 0.4})`;
                        this.ctx.lineWidth = 1;
                    } else {
                        this.ctx.strokeStyle = `rgba(100, 180, 200, ${opacity * 0.3})`;
                        this.ctx.lineWidth = 0.5;
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(nodeA.x, nodeA.y);
                    this.ctx.lineTo(nodeB.x, nodeB.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.restore();
    }

    drawNodes() {
        this.nodes.forEach(node => {
            const pulse = Math.sin(this.time * 2 + node.pulsePhase) * 0.3 + 0.7;
            
            if (node.isHub) {
                // Gold hub nodes with glow
                const glow = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, node.size * 6
                );
                glow.addColorStop(0, `rgba(255, 193, 7, ${0.4 * pulse})`);
                glow.addColorStop(0.5, `rgba(255, 193, 7, ${0.1 * pulse})`);
                glow.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = glow;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size * 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Core
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 193, 7, ${node.opacity})`;
                this.ctx.fill();
                
                // Bright center
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size * 0.4 * pulse, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fill();
            } else {
                // Cyan/blue regular nodes
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(100, 180, 200, ${node.opacity * pulse})`;
                this.ctx.fill();
            }
        });
    }
    
    spawnDataPulse() {
        // Find two connected hub nodes
        const hubNodes = this.nodes.filter(n => n.isHub);
        if (hubNodes.length < 2) return;
        
        const startNode = hubNodes[Math.floor(Math.random() * hubNodes.length)];
        let endNode = hubNodes[Math.floor(Math.random() * hubNodes.length)];
        
        // Make sure they're different and close enough
        let attempts = 0;
        while ((endNode === startNode || this.getDistance(startNode, endNode) > 250) && attempts < 10) {
            endNode = hubNodes[Math.floor(Math.random() * hubNodes.length)];
            attempts++;
        }
        
        if (startNode !== endNode && this.getDistance(startNode, endNode) <= 250) {
            this.dataPulses.push({
                startX: startNode.x,
                startY: startNode.y,
                endX: endNode.x,
                endY: endNode.y,
                progress: 0,
                speed: 0.02 + Math.random() * 0.01
            });
        }
    }
    
    getDistance(a, b) {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
    
    updateAndDrawDataPulses() {
        this.ctx.save();
        
        this.dataPulses = this.dataPulses.filter(pulse => {
            pulse.progress += pulse.speed;
            
            if (pulse.progress >= 1) return false;
            
            const x = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
            const y = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;
            
            // Draw pulse glow
            const glow = this.ctx.createRadialGradient(x, y, 0, x, y, 12);
            glow.addColorStop(0, 'rgba(255, 193, 7, 0.9)');
            glow.addColorStop(0.3, 'rgba(255, 193, 7, 0.4)');
            glow.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 12, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fill();
            
            return true;
        });
        
        this.ctx.restore();
    }

    renderStatic() {
        this.setupCanvas();
        
        // Clean gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, '#050A12');
        gradient.addColorStop(0.4, '#0D1B2A');
        gradient.addColorStop(0.6, '#0D1B2A');
        gradient.addColorStop(1, '#050A12');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Subtle gold glow at top
        const glow = this.ctx.createRadialGradient(
            window.innerWidth / 2, 0, 0,
            window.innerWidth / 2, 0, window.innerHeight * 0.6
        );
        glow.addColorStop(0, 'rgba(255, 193, 7, 0.04)');
        glow.addColorStop(0.5, 'rgba(255, 193, 7, 0.01)');
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Static network nodes for reduced motion mode
        const nodeCount = 30;
        const nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 1,
                isHub: Math.random() > 0.7
            });
        }
        
        // Draw connections
        this.ctx.save();
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.2;
                    this.ctx.strokeStyle = nodes[i].isHub && nodes[j].isHub 
                        ? `rgba(255, 193, 7, ${opacity})` 
                        : `rgba(100, 180, 200, ${opacity * 0.5})`;
                    this.ctx.lineWidth = nodes[i].isHub && nodes[j].isHub ? 1 : 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(nodes[i].x, nodes[i].y);
                    this.ctx.lineTo(nodes[j].x, nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        nodes.forEach(node => {
            if (node.isHub) {
                // Gold hub nodes
                const glow = this.ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4);
                glow.addColorStop(0, 'rgba(255, 193, 7, 0.6)');
                glow.addColorStop(0.5, 'rgba(255, 193, 7, 0.2)');
                glow.addColorStop(1, 'transparent');
                this.ctx.fillStyle = glow;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.fillStyle = 'rgba(255, 193, 7, 0.8)';
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = 'rgba(100, 180, 200, 0.5)';
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        this.ctx.restore();
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        
        this.setupCanvas();
        this.createNetworkNodes();
        this.createSatellites();

        if (this.isMobile || this.prefersReducedMotion) {
            this.renderStatic();
        } else if (wasMobile && !this.isMobile && !this.animationId) {
            // Switched from mobile to desktop, start animation
            this.animate();
        }
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId && !this.prefersReducedMotion && !this.isMobile) {
            this.lastTime = performance.now();
            this.animate();
        }
    }

    destroy() {
        this.pause();
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize animated background
document.addEventListener('DOMContentLoaded', () => {
    new AnimatedBackground();
});

/* ================================
   DEVICE CAPABILITIES DETECTION
   Detects touch, reduced-motion, and performance hints
   WHY: Enables progressive enhancement and device-appropriate behaviors
================================ */
class DeviceCapabilities {
    constructor() {
        this.isTouch = this.detectTouch();
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 768;
        this.isLowEnd = this.detectLowEndDevice();
        this.supportsIntersectionObserver = 'IntersectionObserver' in window;
        
        // Apply body classes for CSS hooks
        this.applyBodyClasses();
        
        // Listen for preference changes
        this.watchPreferences();
    }
    
    detectTouch() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 || 
               window.matchMedia('(pointer: coarse)').matches;
    }
    
    detectLowEndDevice() {
        // Heuristics for low-end device detection
        // Check for low memory, slow connection, or older device indicators
        const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const hasSlowConnection = navigator.connection && 
            (navigator.connection.effectiveType === '2g' || 
             navigator.connection.effectiveType === 'slow-2g' ||
             navigator.connection.saveData === true);
        const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return hasLowMemory || hasSlowConnection || hasLowCores;
    }
    
    applyBodyClasses() {
        const body = document.body;
        if (this.isTouch) body.classList.add('is-touch-device');
        if (this.prefersReducedMotion) body.classList.add('prefers-reduced-motion');
        if (this.isLowEnd) body.classList.add('is-low-end-device');
        if (this.isMobile) body.classList.add('is-mobile');
    }
    
    watchPreferences() {
        // React to reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
            document.body.classList.toggle('prefers-reduced-motion', e.matches);
        });
    }
}

/* ================================
   ACTIVE SECTION TRACKER
   Highlights nav items based on scroll position
   WHY: Gives users visual feedback about where they are on the page
================================ */
class ActiveSectionTracker {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.dropdown-item[href^="#"]');
        this.offset = 150; // Account for sticky header
        
        if (this.sections.length === 0 || this.navLinks.length === 0) return;
        
        this.init();
    }
    
    init() {
        // Use IntersectionObserver for performance
        if ('IntersectionObserver' in window) {
            this.setupObserver();
        } else {
            // Fallback for older browsers
            this.setupScrollListener();
        }
    }
    
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle-ish of viewport
            threshold: 0
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveLink(entry.target.id);
                }
            });
        }, options);
        
        this.sections.forEach(section => this.observer.observe(section));
    }
    
    setupScrollListener() {
        // Throttled scroll listener fallback
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    updateActiveSection() {
        const scrollY = window.scrollY + this.offset;
        
        this.sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            
            if (scrollY >= top && scrollY < top + height) {
                this.setActiveLink(section.id);
            }
        });
    }
    
    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${sectionId}`;
            
            link.classList.toggle('is-active-section', isActive);
            
            // Add subtle visual indicator
            if (isActive) {
                link.style.background = 'rgba(255, 193, 7, 0.08)';
            } else {
                link.style.background = '';
            }
        });
    }
}

/* ================================
   BUTTON DEBOUNCE PROTECTION
   Prevents double-clicks and accidental rapid triggers
   WHY: Prevents duplicate form submissions and action triggers
================================ */
function setupButtonDebounce() {
    const actionButtons = document.querySelectorAll('.btn[href*="wa.me"], .btn[type="submit"]');
    const DEBOUNCE_DELAY = 1000; // 1 second cooldown
    
    actionButtons.forEach(button => {
        let isDebouncing = false;
        
        button.addEventListener('click', (e) => {
            if (isDebouncing) {
                e.preventDefault();
                e.stopPropagation();
                
                // Visual feedback that button was blocked
                button.style.opacity = '0.7';
                setTimeout(() => {
                    button.style.opacity = '';
                }, 200);
                
                return false;
            }
            
            isDebouncing = true;
            
            // Add visual indicator
            button.classList.add('is-processing');
            
            setTimeout(() => {
                isDebouncing = false;
                button.classList.remove('is-processing');
            }, DEBOUNCE_DELAY);
        });
    });
}

// Parallax Effect for Feature Images - ENHANCED with IntersectionObserver
class ParallaxImages {
    constructor() {
        this.images = document.querySelectorAll('.feature-image img, .feature-image .slider-track');
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth < 768;
        this.visibleImages = new Set();
        this.ticking = false;
        
        // Skip parallax on mobile or when user prefers reduced motion
        if (this.prefersReducedMotion || this.isMobile) return;
        
        this.init();
    }

    init() {
        if (this.images.length === 0) return;
        
        // Use IntersectionObserver to only animate visible images
        // WHY: Prevents unnecessary calculations for off-screen elements
        if ('IntersectionObserver' in window) {
            this.setupObserver();
        }
        
        // Throttled scroll handler using requestAnimationFrame
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    setupObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.visibleImages.add(entry.target);
                } else {
                    this.visibleImages.delete(entry.target);
                    // Reset transform when out of view
                    entry.target.style.transform = '';
                }
            });
        }, options);
        
        this.images.forEach(img => this.observer.observe(img));
    }

    updateParallax() {
        // Only process visible images
        this.visibleImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const offset = (scrollPercent - 0.5) * 15; // Reduced intensity for subtlety
            
            // Use translate3d for GPU acceleration
            img.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Typewriter effect for hero heading (if present)
document.addEventListener('DOMContentLoaded', function () {
    const el = document.getElementById('typewriter-heading');
    if (!el) return;
    
    // Skip typewriter effect if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const html = el.innerHTML;
    el.innerHTML = '';
    let i = 0;
    
    // Use innerHTML to preserve span elements with styling
    function type() {
        if (i <= html.length) {
            el.innerHTML = html.slice(0, i);
            i++;
            setTimeout(type, 25);
        }
    }
    type();
});

// Scroll progress bar logic (Enhanced)
document.addEventListener('DOMContentLoaded', function() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) {
        console.warn('Scroll progress bar element not found');
        return;
    }
    
    let ticking = false;
    let lastScrollY = 0;
    
    const updateProgressBar = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        bar.style.width = scrolled + '%';
        
        // Add active class when scrolling
        if (scrollTop > lastScrollY || scrollTop < lastScrollY) {
            bar.classList.add('active');
        }
        
        // Remove active class when at top or bottom
        if (scrolled <= 0 || scrolled >= 100) {
            bar.classList.remove('active');
        }
        
        lastScrollY = scrollTop;
        ticking = false;
    };
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateProgressBar);
            ticking = true;
        }
    }, { passive: true });
    
    // Initial update
    updateProgressBar();
});

// Advanced Navigation System
class NavigationSystem {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        this.focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        this.handleFocusTrap = this.handleFocusTrap.bind(this);
        this.init();
    }

    init() {
        this.setupHamburger();
        this.setupDropdowns();
        this.setupOutsideClick();
        this.setupKeyboardNavigation();
        this.setupActiveLinks();
        this.setupDropdownItemNavigation();
        this.setupWindowResize();
    }

    // Auto-close mobile menu on window resize to desktop
    setupWindowResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navLinks?.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    // Global event delegation for dropdown item navigation
    setupDropdownItemNavigation() {
        document.addEventListener('click', (e) => {
            const dropdownItem = e.target.closest('.dropdown-item');
            if (!dropdownItem) return;
            
            const href = dropdownItem.getAttribute('href');
            if (href && href.startsWith('#') && href !== '#') {
                e.preventDefault();
                e.stopPropagation();
                
                const target = document.querySelector(href);
                if (target) {
                    // Close dropdown and mobile menu
                    this.closeAllDropdowns();
                    this.closeMobileMenu();
                    
                    // Smooth scroll to target with offset for navbar
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }, true); // Use capture phase to ensure this runs first
    }

    setupHamburger() {
        this.hamburger?.addEventListener('click', (e) => {
            this.toggleMobileMenu();
            this.createParticles(e);
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }

    toggleMobileMenu() {
        const isActive = this.navLinks.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', isActive);
        this.hamburger.classList.toggle('active');

        if (isActive) {
            this.trapFocus();
        } else {
            this.releaseFocus();
        }
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.releaseFocus();
    }

    setupDropdowns() {
        let hoverTimeout;
        const HOVER_DELAY = 150; // ms delay before showing dropdown
        const HOVER_EXIT_DELAY = 300; // ms delay before hiding dropdown
        
        this.dropdownToggles.forEach(toggle => {
            const dropdown = toggle.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            const menuItems = menu?.querySelectorAll('.dropdown-item');
            
            // Click handler for mobile/toggle
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isCurrentlyOpen = dropdown.classList.contains('show');
                
                // Close all dropdowns first
                this.closeAllDropdowns();
                
                // If this dropdown wasn't open, open it
                if (!isCurrentlyOpen) {
                    this.openDropdown(dropdown);
                }
            });
            
            // Desktop hover behavior with delay
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.openDropdown(dropdown);
                }, HOVER_DELAY);
            });
            
            dropdown.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.closeDropdown(dropdown);
                }, HOVER_EXIT_DELAY);
            });
            
            // Keyboard navigation for dropdown items
            menuItems?.forEach((item, index) => {
                item.addEventListener('keydown', (e) => {
                    this.handleDropdownKeyboard(e, menuItems, index, dropdown);
                });
            });
            
            // Focus management
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdown(dropdown);
                    // Focus first item
                    setTimeout(() => {
                        menuItems?.[0]?.focus();
                    }, 50);
                }
            });
        });
    }
    
    openDropdown(dropdown) {
        // Close all other dropdowns with animation first
        const otherDropdowns = Array.from(this.dropdowns).filter(d => d !== dropdown && d.classList.contains('show'));
        
        if (otherDropdowns.length > 0) {
            // Add closing animation
            otherDropdowns.forEach(d => {
                d.classList.add('closing');
            });
            
            // Wait for closing animation before opening new one
            setTimeout(() => {
                otherDropdowns.forEach(d => {
                    this.closeDropdown(d);
                    d.classList.remove('closing');
                });
                
                // Now open the new dropdown
                this.showDropdown(dropdown);
            }, 200);
        } else {
            // No other dropdowns open, show immediately
            this.showDropdown(dropdown);
        }
    }
    
    showDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.add('show');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.setAttribute('aria-hidden', 'false');
        }
    }
    
    closeDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.remove('show');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }
    }
    
    closeAllDropdowns() {
        this.dropdowns.forEach(d => this.closeDropdown(d));
    }
    
    handleDropdownKeyboard(e, items, currentIndex, dropdown) {
        let handled = false;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex]?.focus();
                handled = true;
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                items[prevIndex]?.focus();
                handled = true;
                break;
                
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                handled = true;
                break;
                
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                handled = true;
                break;
                
            case 'Escape':
                e.preventDefault();
                this.closeDropdown(dropdown);
                dropdown.querySelector('.dropdown-toggle')?.focus();
                handled = true;
                break;
                
            case 'Tab':
                // Allow natural tab behavior but close dropdown
                if (!e.shiftKey && currentIndex === items.length - 1) {
                    this.closeDropdown(dropdown);
                } else if (e.shiftKey && currentIndex === 0) {
                    this.closeDropdown(dropdown);
                }
                break;
        }
        
        return handled;
    }

    toggleDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const isShowing = dropdown.classList.toggle('show');
        toggle.classList.toggle('active', isShowing);

        // Close other dropdowns
        this.dropdowns.forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('show');
                d.querySelector('.dropdown-toggle')?.classList.remove('active');
            }
        });
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            // Close dropdowns only if clicking outside dropdown area
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }

            // Close mobile menu if clicking outside navbar
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                this.closeAllDropdowns();
            }
        });
    }

    setupActiveLinks() {
        const links = document.querySelectorAll('.nav-link, .nav-links-right .btn');
        links.forEach(link => {
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
            });
        });
    }

    trapFocus() {
        const focusables = this.navLinks?.querySelectorAll(this.focusableSelector);
        if (!focusables || focusables.length === 0) return;

        this.focusables = Array.from(focusables);
        this.firstFocusable = this.focusables[0];
        this.lastFocusable = this.focusables[this.focusables.length - 1];

        document.addEventListener('keydown', this.handleFocusTrap);
        this.firstFocusable.focus();
    }

    releaseFocus() {
        document.removeEventListener('keydown', this.handleFocusTrap);
        this.firstFocusable = null;
        this.lastFocusable = null;
        if (this.hamburger) {
            this.hamburger.focus();
        }
    }

    handleFocusTrap(e) {
        if (e.key !== 'Tab' || !this.firstFocusable || !this.lastFocusable) return;

        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }

    createParticles(event) {
        const x = event.clientX;
        const y = event.clientY;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            const angle = (Math.PI * 2 * i) / 6;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = 'linear-gradient(135deg, #404EED, #5865F2)';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }
}

// Scroll Animation Manager - ENHANCED with better performance and stagger
class ScrollAnimationManager {
    constructor() {
        this.sections = document.querySelectorAll('.feature-section');
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Skip animations entirely if user prefers reduced motion
        if (this.prefersReducedMotion) {
            this.showAllImmediately();
            return;
        }
        
        this.observerOptions = {
            threshold: 0.1, // Lower threshold for earlier trigger
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    // Fallback: Show all content immediately without animation
    showAllImmediately() {
        this.sections.forEach(section => {
            section.classList.add('in-view');
            section.style.opacity = '1';
            section.style.transform = 'none';
            
            const children = section.querySelectorAll('.feature-text, .feature-image');
            children.forEach(child => {
                child.classList.add('in-view');
                child.style.opacity = '1';
                child.style.transform = 'none';
            });
        });
    }

    init() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            this.showAllImmediately();
            return;
        }
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSection(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => {
            section.classList.add('fade-in-section');
            
            // Add animation classes to children
            const textElements = section.querySelectorAll('.feature-text');
            const imageElements = section.querySelectorAll('.feature-image');
            
            // Check if reversed layout
            const isReversed = section.querySelector('.feature-grid.reverse');
            
            textElements.forEach(el => {
                el.classList.add(isReversed ? 'slide-in-right' : 'slide-in-left');
            });
            
            imageElements.forEach(el => {
                el.classList.add(isReversed ? 'slide-in-left' : 'slide-in-right');
            });
            
            this.observer.observe(section);
        });
    }
    
    animateSection(section) {
        section.classList.add('in-view');
        
        // Stagger child animations with smooth timing
        const textElements = section.querySelectorAll('.feature-text');
        const imageElements = section.querySelectorAll('.feature-image');
        
        // Use a single RAF for all animations
        requestAnimationFrame(() => {
            textElements.forEach((child, index) => {
                child.style.transitionDelay = `${index * 100 + 50}ms`;
                child.classList.add('in-view');
            });
            
            imageElements.forEach((child, index) => {
                child.style.transitionDelay = `${index * 100 + 150}ms`;
                child.classList.add('in-view');
            });
        });
    }
}

// Smooth Scroll Handler

class SmoothScroller {

    constructor() {

        this.init();

    }



    init() {

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {

            anchor.addEventListener('click', (e) => {

                const href = anchor.getAttribute('href');

                if (href !== '#' && document.querySelector(href)) {

                    e.preventDefault();

                    this.smoothScroll(document.querySelector(href));

                }

            });

        });

    }



    smoothScroll(target) {

        const offsetTop = target.offsetTop - 80;

        window.scrollTo({

            top: offsetTop,

            behavior: 'smooth'

        });

    }

}



// Parallax Scroll Effect

class ParallaxEffect {

    constructor() {

        this.init();

    }



    init() {

        const heroSection = document.querySelector('.hero');

        window.addEventListener('scroll', () => {

            const scrollY = window.scrollY;

            if (heroSection) {

                heroSection.style.backgroundPosition = `0 ${scrollY * 0.5}px`;

            }

        });

    }

}



// Button Interaction Effects

class ButtonEffects {

    constructor() {

        this.init();

    }



    init() {

        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(btn => {

            btn.addEventListener('mouseenter', (e) => {

                this.createGlowEffect(btn);

            });

        });

    }



    createGlowEffect(element) {

        const clone = element.cloneNode(true);

        clone.style.position = 'absolute';

        clone.style.opacity = '0.3';

        clone.style.pointerEvents = 'none';

        element.parentElement.appendChild(clone);

        

        setTimeout(() => clone.remove(), 300);

    }

}



// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.querySelector('.toast-container');
    }

    show(message, type = 'info', duration = 4000) {
        if (!this.container) return;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    remove(toast) {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }
}

// Initialize all modules

const toastManager = new ToastManager();

// Navbar scroll behavior - ENHANCED with smart hide/show
class NavbarScrollEffect {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScrollY = 0;
        this.scrollThreshold = 5; // Minimum scroll delta to trigger hide/show
        this.hideThreshold = 300; // Don't hide navbar until user has scrolled this far
        this.ticking = false;
        this.isHidden = false;
        this.init();
    }
    
    init() {
        if (!this.navbar) return;
        
        // Add CSS for smooth navbar transitions
        this.navbar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease';
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateNavbar();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    updateNavbar() {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - this.lastScrollY;
        
        // Add scrolled class when past threshold (visual styling)
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
            // Always show navbar at top of page
            this.showNavbar();
        }
        
        // Smart hide/show based on scroll direction
        // Only activate after user has scrolled past hideThreshold
        if (scrollY > this.hideThreshold) {
            if (scrollDelta > this.scrollThreshold && !this.isHidden) {
                // Scrolling down - hide navbar
                this.hideNavbar();
            } else if (scrollDelta < -this.scrollThreshold && this.isHidden) {
                // Scrolling up - show navbar
                this.showNavbar();
            }
        }
        
        this.lastScrollY = scrollY;
    }
    
    hideNavbar() {
        this.navbar.style.transform = 'translateY(-100%)';
        this.isHidden = true;
    }
    
    showNavbar() {
        this.navbar.style.transform = 'translateY(0)';
        this.isHidden = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // Initialize core utilities first
    const deviceCapabilities = new DeviceCapabilities();
    
    new NavigationSystem();

    new ScrollAnimationManager();

    new SmoothScroller();

    new ParallaxEffect();

    new ButtonEffects();

    new ParallaxImages();
    
    new NavbarScrollEffect();
    
    // Initialize active section tracking for navigation
    new ActiveSectionTracker();

    setupCapabilityTabs();

    // Add ripple effect to buttons (skip on touch devices to prevent delay)
    if (!deviceCapabilities.isTouch) {
        setupRippleEffect();
    }

    // Initialize image slider
    setupImageSlider();
    
    // Initialize button debouncing
    setupButtonDebounce();

    // Dynamic copyright year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            // Max 800ms preloader - remove immediately if reduced motion preferred
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                preloader.style.display = 'none';
            } else {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 400);
            }
        }
    });
    
    // Fallback: Force remove preloader after 800ms max
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 400);
        }
    }, 800);
    
    // Scroll indicator auto-hide after first scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        let hasScrolled = false;
        const hideScrollIndicator = () => {
            if (!hasScrolled && window.scrollY > 100) {
                hasScrolled = true;
                scrollIndicator.classList.add('hidden');
                window.removeEventListener('scroll', hideScrollIndicator);
            }
        };
        window.addEventListener('scroll', hideScrollIndicator, { passive: true });
        
        // Also hide on click
        scrollIndicator.addEventListener('click', () => {
            scrollIndicator.classList.add('hidden');
        });
    }
});

// Capability tab switching for Tasker section
function setupCapabilityTabs() {
    const cards = document.querySelectorAll('.capability-card');
    cards.forEach(card => {
        const tabs = card.querySelectorAll('.capability-tab');
        const panels = card.querySelectorAll('.capability-panel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('aria-controls');

                // toggle tab state
                tabs.forEach(t => {
                    const isActive = t === tab;
                    t.classList.toggle('is-active', isActive);
                    t.setAttribute('aria-selected', isActive);
                    t.setAttribute('tabindex', isActive ? '0' : '-1');
                });

                // toggle panels
                panels.forEach(panel => {
                    const shouldShow = panel.id === targetId;
                    if (shouldShow) {
                        panel.removeAttribute('hidden');
                        panel.classList.add('is-active');
                    } else {
                        panel.setAttribute('hidden', 'hidden');
                        panel.classList.remove('is-active');
                    }
                });
            });
        });
    });
}

// Ripple Effect for Buttons
function setupRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .nav-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Remove existing ripples
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            this.appendChild(ripple);

            // Clean up after animation
            setTimeout(() => ripple.remove(), 650);
        });
    });
}
// Image Slider for Device Sales & Repairs
function setupImageSlider() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        const prevBtn = slider.querySelector('.slider-nav.prev');
        const nextBtn = slider.querySelector('.slider-nav.next');
        const dots = slider.querySelectorAll('.dot');
        let currentIndex = 0;
        let autoSlideInterval;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        function nextSlide() {
            const next = (currentIndex + 1) % images.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentIndex - 1 + images.length) % images.length;
            showSlide(prev);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Start auto-slide
        startAutoSlide();
    });
}

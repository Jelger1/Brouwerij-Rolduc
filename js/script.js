// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            
            // Update aria-expanded for accessibility
            mobileMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
            
            // Change icon between hamburger and X
            const icon = mobileMenuBtn.querySelector('i');
            if (isHidden) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileMenuBtn.setAttribute('aria-label', 'Menu sluiten');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-label', 'Menu openen');
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Beer Carousel
    let currentSlide = 0;
    const carousel = document.getElementById('beer-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (carousel && prevBtn && nextBtn) {
        const slides = carousel.children.length;
        let itemsToShow = getItemsToShow();
        
        function getItemsToShow() {
            if (window.innerWidth >= 1024) return 3; // Desktop
            if (window.innerWidth >= 768) return 2;  // Tablet
            return 1; // Mobile
        }
        
        function updateCarousel() {
            itemsToShow = getItemsToShow();
            const maxSlide = Math.max(0, slides - itemsToShow);
            
            // Ensure currentSlide is within bounds
            if (currentSlide > maxSlide) {
                currentSlide = maxSlide;
            }
            
            const translateX = -currentSlide * (100 / itemsToShow);
            carousel.style.transform = `translateX(${translateX}%)`;
            
            // Update button states
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide >= maxSlide;
            
            // Visual feedback for disabled buttons
            if (currentSlide === 0) {
                prevBtn.classList.add('opacity-50');
            } else {
                prevBtn.classList.remove('opacity-50');
            }
            
            if (currentSlide >= maxSlide) {
                nextBtn.classList.add('opacity-50');
            } else {
                nextBtn.classList.remove('opacity-50');
            }
        }
        
        prevBtn.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            const maxSlide = Math.max(0, slides - itemsToShow);
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateCarousel();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            updateCarousel();
        });
        
        // Initialize carousel
        updateCarousel();
        
        // Auto-rotate carousel
        let autoRotateInterval = setInterval(() => {
            const maxSlide = Math.max(0, slides - itemsToShow);
            if (currentSlide < maxSlide) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateCarousel();
        }, 6000); // Changed to 6 seconds for better UX
        
        // Pause auto-rotate on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoRotateInterval = setInterval(() => {
                const maxSlide = Math.max(0, slides - itemsToShow);
                if (currentSlide < maxSlide) {
                    currentSlide++;
                } else {
                    currentSlide = 0;
                }
                updateCarousel();
            }, 6000);
        });
    }

    // B2C/B2B Toggle
    const b2cTab = document.getElementById('b2c-tab');
    const b2bTab = document.getElementById('b2b-tab');
    
    if (b2cTab && b2bTab) {
        b2cTab.addEventListener('click', function() {
            // Update button styles
            b2cTab.classList.add('bg-green-main', 'text-white');
            b2cTab.classList.remove('text-green-main');
            b2bTab.classList.remove('bg-green-main', 'text-white');
            b2bTab.classList.add('text-green-main');
            
            // Update product prices for B2C
            updateProductPrices('b2c');
        });
        
        b2bTab.addEventListener('click', function() {
            // Update button styles
            b2bTab.classList.add('bg-green-main', 'text-white');
            b2bTab.classList.remove('text-green-main');
            b2cTab.classList.remove('bg-green-main', 'text-white');
            b2cTab.classList.add('text-green-main');
            
            // Update product prices for B2B
            updateProductPrices('b2b');
        });
    }

    // Shopping Cart Functionality
    let cart = [];
    let cartTotal = 0;
    
    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartSummary = document.getElementById('cart-summary');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
        
        if (cartSummary) {
            cartSummary.textContent = `Winkelwagen (${cart.length} items)`;
        }
        
        if (cartTotalElement) {
            cartTotalElement.textContent = `€${cartTotal.toFixed(2).replace('.', ',')}`;
        }
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productName = this.getAttribute('data-name') || this.closest('.bg-white, .bg-neutral-bg').querySelector('h3')?.textContent;
            const productPriceAttr = this.getAttribute('data-price');
            let productPrice;
            
            if (productPriceAttr) {
                productPrice = parseFloat(productPriceAttr);
            } else {
                const priceElement = this.closest('.bg-white, .bg-neutral-bg').querySelector('.text-gold-accent');
                productPrice = priceElement ? parseFloat(priceElement.textContent.replace('€', '').replace(',', '.')) : 0;
            }
            
            if (productName && productPrice) {
                cart.push({
                    name: productName,
                    price: productPrice
                });
                
                cartTotal += productPrice;
                updateCartDisplay();
                
                // Show feedback
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check mr-1"></i> Toegevoegd';
                this.classList.add('bg-green-600');
                this.classList.remove('bg-green-main');
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.classList.remove('bg-green-600');
                    this.classList.add('bg-green-main');
                }, 2000);
            }
        });
    });

    // Also handle cart-plus icon buttons (for legacy support)
    document.querySelectorAll('.fa-cart-plus').forEach(button => {
        const parentButton = button.closest('button');
        if (parentButton && !parentButton.classList.contains('add-to-cart')) {
            parentButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.bg-white') || this.closest('.bg-neutral-bg');
                const productNameElement = productCard.querySelector('h3');
                const productPriceElement = productCard.querySelector('.text-gold-accent');
                
                if (productNameElement && productPriceElement) {
                    const productName = productNameElement.textContent;
                    const productPrice = parseFloat(productPriceElement.textContent.replace('€', '').replace(',', '.'));
                    
                    cart.push({
                        name: productName,
                        price: productPrice
                    });
                    
                    cartTotal += productPrice;
                    updateCartDisplay();
                    
                    // Show feedback
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check mr-1"></i> Toegevoegd';
                    this.classList.add('bg-green-600');
                    this.classList.remove('bg-green-main');
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.classList.remove('bg-green-600');
                        this.classList.add('bg-green-main');
                    }, 2000);
                }
            });
        }
    });

    // Video Buttons - Add support for .video-btn class
    const videoButtons = document.querySelectorAll('.video-btn');
    videoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            const videoTitle = this.getAttribute('data-video-title') || this.textContent.trim();
            
            if (videoUrl) {
                // Use real video modal for YouTube links
                showVideoModal(videoUrl, videoTitle);
            } else {
                // Fallback to demo for buttons without URL
                const title = this.textContent.trim();
                playDemoVideo(title);
            }
        });
    });

    // Reserve Button
    const reserveBtn = document.getElementById('reserve-btn');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', function() {
            showReservationModal();
        });
    }

    // Hero Buttons
    const heroReserveBtn = document.getElementById('hero-reserve-btn');
    const heroShopBtn = document.getElementById('hero-shop-btn');
    
    if (heroReserveBtn) {
        heroReserveBtn.addEventListener('click', function() {
            document.getElementById('proeflokaal').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    if (heroShopBtn) {
        heroShopBtn.addEventListener('click', function() {
            document.getElementById('winkel').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // Checkout Button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Je winkelwagen is leeg!');
                return;
            }
            
            let orderSummary = 'Bestelling:\\n\\n';
            cart.forEach(item => {
                orderSummary += `${item.name} - €${item.price.toFixed(2)}\\n`;
            });
            orderSummary += `\\nTotaal: €${cartTotal.toFixed(2)}`;
            
            alert(orderSummary + '\\n\\nIn de echte website zou je nu doorgestuurd worden naar de betaalpagina.');
            
            // Reset cart
            cart = [];
            cartTotal = 0;
            updateCartDisplay();
        });
    }

    // Form submissions
    const horecaForm = document.getElementById('horeca-form');
    
    if (horecaForm) {
        horecaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    input.classList.remove('border-gray-300');
                } else {
                    input.classList.remove('border-red-500');
                    input.classList.add('border-gray-300');
                }
            });
            
            if (isValid) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Versturen...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Verzonden!';
                    submitBtn.classList.add('bg-green-600');
                    
                    setTimeout(() => {
                        alert('Bedankt voor je horeca aanvraag! We nemen binnen 24 uur contact met je op.');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('bg-green-600');
                        submitBtn.classList.add('bg-green-main');
                        this.reset();
                    }, 1500);
                }, 2000);
            } else {
                alert('Vul alle verplichte velden in!');
            }
        });
    }
    
    // General form handler for other forms
    document.querySelectorAll('form:not(#horeca-form)').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                    input.classList.remove('border-gray-300');
                } else {
                    input.classList.remove('border-red-500');
                    input.classList.add('border-gray-300');
                }
            });
            
            if (isValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Versturen...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Verzonden!';
                    submitBtn.classList.add('bg-green-600');
                    
                    setTimeout(() => {
                        alert('Bedankt! Je bericht is verzonden. We nemen zo snel mogelijk contact met je op.');
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('bg-green-600');
                        submitBtn.classList.add('bg-green-main');
                        form.reset();
                    }, 1500);
                }, 2000);
            } else {
                alert('Vul alle verplichte velden in!');
            }
        });
    });

    // Video Play Function
    function playDemoVideo(title) {
        const videoContainer = document.createElement('div');
        videoContainer.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div class="bg-white p-8 rounded-lg max-w-2xl mx-4 text-center">
                    <h2 class="text-2xl font-bold text-green-dark mb-4">${title}</h2>
                    <div class="w-full h-64 bg-black flex items-center justify-center text-white mb-4">
                        <div class="text-center">
                            <i class="fas fa-video text-4xl mb-4"></i>
                            <p>Video wordt afgespeeld...</p>
                            <p class="text-sm mt-2">Demo - Hier zou de echte video staan</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="bg-green-main text-white px-6 py-2 rounded-lg hover:bg-green-dark transition-colors">
                        Sluiten
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(videoContainer);
    }

    // Video Modal functionality
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const videoModalTitle = document.getElementById('video-modal-title');
    const experienceVideoBtn = document.getElementById('experience-video-btn');
    const breweryVideoBtn = document.getElementById('brewery-video-btn');
    const breweryVideoContainer = document.getElementById('brewery-video-container');
    const closeVideoModal = document.getElementById('close-video-modal');
    
    // YouTube video URLs
    const experienceVideoUrl = 'https://www.youtube.com/embed/uF84oyxJ-Hc?autoplay=1&rel=0&modestbranding=1';
    const breweryProcessVideoUrl = 'https://www.youtube.com/embed/HjWqJNvIk7A?autoplay=1&rel=0&modestbranding=1';
    
    // Function to show video modal with custom URL and title
    function showVideoModal(videoUrl, title) {
        if (videoIframe && videoModal) {
            // Add autoplay and other parameters if not already present
            const enhancedUrl = videoUrl.includes('?') 
                ? `${videoUrl}&autoplay=1&rel=0&modestbranding=1`
                : `${videoUrl}?autoplay=1&rel=0&modestbranding=1`;
            
            videoIframe.src = enhancedUrl;
            if (videoModalTitle) {
                videoModalTitle.textContent = title || 'Brouwerij Rolduc Video';
            }
            videoModal.style.display = 'flex';
            videoModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Function to open brewery video
    function openBreweryVideo() {
        if (videoIframe && videoModal) {
            videoIframe.src = breweryProcessVideoUrl;
            if (videoModalTitle) {
                videoModalTitle.textContent = 'Ons Brouwproces - Van Graan tot Glas';
            }
            videoModal.style.display = 'flex';
            videoModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Open video modal - Experience video
    if (experienceVideoBtn) {
        experienceVideoBtn.addEventListener('click', function() {
            if (videoIframe && videoModal) {
                videoIframe.src = experienceVideoUrl;
                if (videoModalTitle) {
                    videoModalTitle.textContent = 'Brouwerij Rolduc - Beleef de Magie';
                }
                videoModal.style.display = 'flex';
                videoModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Open video modal - Brewery process video (button)
    if (breweryVideoBtn) {
        breweryVideoBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openBreweryVideo();
        });
    }
    
    // Open video modal - Brewery process video (container)
    if (breweryVideoContainer) {
        breweryVideoContainer.addEventListener('click', function() {
            openBreweryVideo();
        });
    }
    
    // Close video modal
    function closeModal() {
        if (videoModal) {
            videoModal.style.display = 'none';
            videoModal.classList.add('hidden');
        }
        if (videoIframe) {
            videoIframe.src = '';
        }
        document.body.style.overflow = 'auto';
    }
    
    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply initial styles and observe sections for animations
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-gold-accent');
            link.classList.add('text-white');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('text-gold-accent');
                link.classList.remove('text-white');
            }
        });
    });

    // Initialize cart display
    updateCartDisplay();
});

// Helper function to update product prices
function updateProductPrices(type) {
    const priceElements = document.querySelectorAll('#product-grid .text-gold-accent');
    const baseprices = [19.95, 42.50, 24.95, 19.95]; // Base prices for products
    
    priceElements.forEach((element, index) => {
        if (index < baseprices.length) {
            let newPrice = baseprices[index];
            
            if (type === 'b2b') {
                // B2B prices are typically lower (20% discount)
                newPrice = baseprices[index] * 0.8;
            }
            
            element.textContent = `€${newPrice.toFixed(2).replace('.', ',')}`;
        }
    });
}

// Reservation System
function showReservationModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-green-dark">Reservering Proeflokaal</h2>
                        <button onclick="closeReservationModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="reservation-form" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-green-dark font-medium mb-2">Voornaam *</label>
                                <input type="text" name="firstName" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-green-dark font-medium mb-2">Achternaam *</label>
                                <input type="text" name="lastName" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-green-dark font-medium mb-2">E-mail *</label>
                            <input type="email" name="email" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                        </div>
                        
                        <div>
                            <label class="block text-green-dark font-medium mb-2">Telefoonnummer *</label>
                            <input type="tel" name="phone" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-green-dark font-medium mb-2">Datum *</label>
                                <input type="date" name="date" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-green-dark font-medium mb-2">Tijd *</label>
                                <select name="time" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                                    <option value="">Selecteer tijd</option>
                                    <option value="14:00">14:00</option>
                                    <option value="15:00">15:00</option>
                                    <option value="16:00">16:00</option>
                                    <option value="17:00">17:00</option>
                                    <option value="18:00">18:00</option>
                                    <option value="19:00">19:00</option>
                                    <option value="20:00">20:00</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-green-dark font-medium mb-2">Aantal personen *</label>
                            <select name="guests" required class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none">
                                <option value="">Selecteer aantal</option>
                                <option value="2">2 personen</option>
                                <option value="3">3 personen</option>
                                <option value="4">4 personen</option>
                                <option value="5">5 personen</option>
                                <option value="6">6 personen</option>
                                <option value="7">7 personen</option>
                                <option value="8">8 personen</option>
                                <option value="9">9 personen</option>
                                <option value="10">10 personen</option>
                                <option value="11">11 personen</option>
                                <option value="12">12 personen</option>
                                <option value="15">15 personen</option>
                                <option value="20">20 personen</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-green-dark font-medium mb-2">Opmerkingen</label>
                            <textarea name="notes" rows="3" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-gold-accent focus:outline-none" placeholder="Eventuele allergieën, wensen, etc."></textarea>
                        </div>
                        
                        <div class="bg-green-light p-4 rounded-lg">
                            <p class="text-sm text-green-dark">
                                <i class="fas fa-info-circle mr-2"></i>
                                Reserveringen zijn mogelijk van vrijdag t/m zondag. 
                                Reserveer om 13:00u op zaterdag met 4+ personen en krijg 20% korting op kaas-worstplankjes!
                            </p>
                        </div>
                        
                        <div class="flex space-x-4 pt-4">
                            <button type="button" onclick="closeReservationModal()" class="flex-1 border border-green-main text-green-main py-3 rounded-lg hover:bg-green-main hover:text-white transition-colors">
                                Annuleren
                            </button>
                            <button type="submit" class="flex-1 bg-green-main text-white py-3 rounded-lg hover:bg-green-dark transition-colors">
                                <i class="fas fa-calendar-check mr-2"></i>
                                Reserveren
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add form submission handler
    const form = document.getElementById('reservation-form');
    form.addEventListener('submit', handleReservationSubmit);
    
    // Set minimum date to today
    const dateInput = form.querySelector('input[name="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeReservationModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function handleReservationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservationData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        notes: formData.get('notes') || 'Geen opmerkingen'
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Bezig met reserveren...';
    submitBtn.disabled = true;
    
    // Simulate email sending (in real implementation, this would call a backend service)
    setTimeout(() => {
        sendReservationEmail(reservationData);
        closeReservationModal();
        showSuccessMessage(reservationData);
    }, 2000);
}

function sendReservationEmail(data) {
    // In a real implementation, this would send an actual email
    // For now, we'll simulate the email content and log it
    const emailContent = `
Nieuwe reservering voor Brouwerij Rolduc Proeflokaal:

Klantgegevens:
- Naam: ${data.firstName} ${data.lastName}
- E-mail: ${data.email}
- Telefoon: ${data.phone}

Reserveringsdetails:
- Datum: ${new Date(data.date).toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Tijd: ${data.time}
- Aantal personen: ${data.guests}
- Opmerkingen: ${data.notes}

Deze reservering werd automatisch gegenereerd via de website.
Neem binnen 24 uur contact op met de klant voor bevestiging.

Met vriendelijke groet,
Brouwerij Rolduc Website
    `;
    
    console.log('Email zou worden verstuurd naar info@brouwerij-rolduc.nl:', emailContent);
    
    // In een echte implementatie zou hier een API call komen naar de backend:
    // fetch('/api/send-reservation-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ to: 'info@brouwerij-rolduc.nl', content: emailContent, reservationData: data })
    // });
}

function showSuccessMessage(data) {
    const successModal = document.createElement('div');
    successModal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-lg max-w-md w-full p-6 text-center">
                <div class="text-green-main text-5xl mb-4">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2 class="text-2xl font-bold text-green-dark mb-4">Reservering Ontvangen!</h2>
                <p class="text-gray-700 mb-4">
                    Bedankt ${data.firstName}! Je reservering voor ${data.guests} personen op 
                    ${new Date(data.date).toLocaleDateString('nl-NL')} om ${data.time} is ontvangen.
                </p>
                <p class="text-sm text-gray-600 mb-6">
                    Je ontvangt binnen 24 uur een bevestiging per e-mail op ${data.email}.
                    Voor vragen kun je ons bellen: 045-123 4567
                </p>
                <button onclick="closeSuccessModal()" class="bg-green-main text-white px-8 py-3 rounded-lg hover:bg-green-dark transition-colors">
                    Sluiten
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(successModal);
}

function closeSuccessModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Horeca form submission
    const horecaForm = document.getElementById('horeca-form');
    if (horecaForm) {
        horecaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Bezig met versturen...';
            submitBtn.disabled = true;
            
            // Simulate email sending
            setTimeout(() => {
                // In real implementation, send email here
                console.log('Horeca aanvraag zou worden verstuurd:', Object.fromEntries(formData));
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Verzonden!';
                submitBtn.classList.remove('bg-green-main', 'hover:bg-green-dark');
                submitBtn.classList.add('bg-green-600');
                
                // Reset form after delay
                setTimeout(() => {
                    horecaForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-600');
                    submitBtn.classList.add('bg-green-main', 'hover:bg-green-dark');
                }, 3000);
            }, 1500);
        });
    }
});

// Age verification popup (for legal compliance)
function showAgeVerification() {
    const ageModal = document.createElement('div');
    ageModal.className = 'age-verification-modal';
    ageModal.innerHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]">
            <div class="bg-white p-8 rounded-lg max-w-md mx-4 text-center shadow-2xl">
                <div class="text-gold-accent text-4xl mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 class="text-2xl font-bold text-green-dark mb-4">Leeftijdsverificatie</h2>
                <p class="text-gray-700 mb-4">Ben je 18 jaar of ouder?</p>
                <p class="text-sm text-gray-500 mb-6">
                    Deze website bevat informatie over alcoholische dranken en is uitsluitend bestemd voor personen van 18 jaar en ouder.
                </p>
                <div class="flex space-x-4 justify-center">
                    <button onclick="acceptAge()" class="bg-green-main text-white px-6 py-3 rounded-lg hover:bg-green-dark transition-colors font-semibold">
                        <i class="fas fa-check mr-2"></i>
                        Ja, ik ben 18+
                    </button>
                    <button onclick="rejectAge()" class="border-2 border-red-500 text-red-500 px-6 py-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors font-semibold">
                        <i class="fas fa-times mr-2"></i>
                        Nee
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(ageModal);
    
    // Prevent body scroll and disable interactions
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    ageModal.style.pointerEvents = 'auto';
}

function acceptAge() {
    localStorage.setItem('ageVerified', 'true');
    localStorage.setItem('ageVerificationDate', new Date().toISOString());
    
    const modal = document.querySelector('.age-verification-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        document.body.style.pointerEvents = 'auto';
    }
}

function rejectAge() {
    // Redirect to a safe website
    window.location.href = 'https://www.rijksoverheid.nl/onderwerpen/alcohol/vraag-en-antwoord/vanaf-welke-leeftijd-mag-je-alcohol-kopen-en-drinken';
}

// Check age verification on page load
function checkAgeVerification() {
    const ageVerified = localStorage.getItem('ageVerified');
    const verificationDate = localStorage.getItem('ageVerificationDate');
    
    // Check if verification is older than 24 hours
    if (ageVerified && verificationDate) {
        const verifiedDate = new Date(verificationDate);
        const now = new Date();
        const hoursDiff = (now - verifiedDate) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            // Remove old verification
            localStorage.removeItem('ageVerified');
            localStorage.removeItem('ageVerificationDate');
        }
    }
    
    // Show verification if not verified or expired
    if (!localStorage.getItem('ageVerified')) {
        // Small delay to ensure page is loaded
        setTimeout(showAgeVerification, 500);
    }
}

// Initialize age verification check
checkAgeVerification();

// Bokkenrijders Likeuren Modal
function initializeLikeurenModal() {
    const likeurenModal = document.getElementById('likeuren-modal');
    const closeLikeurenModal = document.getElementById('close-likeuren-modal');
    const modalToProeflokaal = document.getElementById('modal-to-proeflokaal');
    const modalToWinkel = document.getElementById('modal-to-winkel');
    
    // Check if modal exists, if not, just return
    if (!likeurenModal || !closeLikeurenModal) {
        return;
    }
    
    function openModal() {
        likeurenModal.style.display = 'flex';
        likeurenModal.classList.remove('closing');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

        // Close modal with animation
        function closeModal() {
            likeurenModal.classList.add('closing');
            setTimeout(() => {
                likeurenModal.style.display = 'none';
                likeurenModal.classList.remove('closing');
                document.body.style.overflow = 'auto'; // Restore scrolling
            }, 300); // Match CSS animation duration
        }
        
        // Close modal and navigate to section
        function closeModalAndNavigate(targetId) {
            closeModal();
            // Wait for modal to close before scrolling
            setTimeout(() => {
                const target = document.getElementById(targetId);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 350); // Slightly longer than modal close animation
        }
        
        // Close modal when clicking X button
        closeLikeurenModal.addEventListener('click', closeModal);
        
        // Modal navigation buttons
        if (modalToProeflokaal) {
            modalToProeflokaal.addEventListener('click', function() {
                closeModalAndNavigate('proeflokaal');
            });
        }
        
        if (modalToWinkel) {
            modalToWinkel.addEventListener('click', function() {
                closeModalAndNavigate('winkel');
            });
        }
        
        // Close modal when clicking outside
        likeurenModal.addEventListener('click', function(e) {
            if (e.target === likeurenModal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && likeurenModal.style.display === 'flex') {
                closeModal();
            }
        });
}

// Initialize likeuren modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLikeurenModal();
});

// Brouwproces Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const brewProcessBtn = document.getElementById('brew-process-btn');
    const brewProcessModal = document.getElementById('brewprocess-modal');
    const closeBrewProcessModal = document.getElementById('close-brewprocess-modal');
    
    if (brewProcessBtn && brewProcessModal) {
        brewProcessBtn.addEventListener('click', function() {
            brewProcessModal.classList.remove('hidden');
            brewProcessModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeBrewProcessModal && brewProcessModal) {
        closeBrewProcessModal.addEventListener('click', function() {
            brewProcessModal.classList.add('hidden');
            brewProcessModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (brewProcessModal) {
        brewProcessModal.addEventListener('click', function(e) {
            if (e.target === brewProcessModal) {
                brewProcessModal.classList.add('hidden');
                brewProcessModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && brewProcessModal.style.display === 'flex') {
                brewProcessModal.classList.add('hidden');
                brewProcessModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Beer Info Modal functionality for homepage carousel
    const beerInfoData = {
        'Abdijbier Rolduc Blond': {
            name: 'Abdijbier Rolduc Blond',
            description: 'Een heerlijk \'Belgisch blond\' met een tweede vergisting op de fles. Een aangenaam smaakvol abdijbier, afgebrouwen met zoethout waaraan het kleur en karakter dankt. Abdijbier Rolduc is een heerlijke begeleider van diverse lichte gerechten zoals gevogelte en salade.'
        },
        'Abdijbier Rolduc Dubbel': {
            name: 'Abdijbier Rolduc Dubbel',
            description: 'Dit bovengistend abdijbier dubbel nodigt uit tot genieten. De mooie donkere kleur verwijst naar de monnikspij en de smaak is vol en afgerond met tonen van koffie en pure chocolade. Abdijbier Rolduc Dubbel smaakt prima bij krachtiger gerechten als geroosterd varkensvlees, saté of zoete gerechten met pure chocolade of brownies.'
        },
        'Abdijbier Rolduc Tripel': {
            name: 'Abdijbier Rolduc Tripel',
            description: 'Een tripel met aroma\'s van rijp geel fruit die terugkomen in de smaak. De fruitige tonen gecombineerd met een licht bittere afdronk brengen dit bijzondere bier mooi in balans. Deze heerlijke tripel is een genieter bij uitstek. Laat de mooie blonde kleur je uitnodigen om een slok te nemen en de intense smaken waar te nemen die dit bier te bieden heeft. Een stukje hemel op aarde.'
        },
        'Blonde Non': {
            name: 'Blonde Non',
            description: 'Een heerlijk bloemig en fruitig zwaar blond van 8%. Mistig door de vergisting op fles en zeer toegankelijk door zijn heerlijk afgeronde smaken. De Blonde Non is een echte uitdager en past goed bij vlees van de grill of bijvoorbeeld een kaasplank met pittige kazen. Een vriendin voor het leven!'
        },
        'Paters Broen': {
            name: 'Paters Broen',
            description: 'Een smakelijk zwaar donker bier van 7%. De beter geëeste mouten geven het bier zijn donkere kleur en de smaak van rijp rood fruit, laurier, kersen en tonen van koffie. De afdronk is zacht bitter en smaken blijven lekker lang hangen en doen je verlangen naar de volgende slok.'
        },
        'Kloeëster IPA': {
            name: 'Kloeëster IPA', 
            description: 'Een zeer verfrissende IPA die zijn fruitige- en citrusaroma\'s dankt aan de aromahoppen waarmee hij gebrouwen wordt. De Kloëster IPA is ver doorvergist en krijgt daardoor een aangenaam droge afdronk met fijne smaken van verse thee. Een heerlijke dorstlesser die gelukkig niet bol staat van de bitterheid!'
        },
        'Kølsje Jong': {
            name: 'Kølsje Jong',
            description: 'Een bovengistend blond bier naar receptuur uit Keulen. Bovengistend en daardoor fruitiger en smaakvoller dan pils maar net zo doordrinkbaar en dorstlessend. Onze Kølsje Jong heeft een alcoholpercentage van 5,5% en past dus prima bij de borrel, een feest en elk ander gezellig moment!'
        },
        'Roda Bier': {
            name: 'Roda Bier',
            description: 'Gebrouwen voor de Trots van \'t Zuiden! Krachtig bovengistend blond bier van 7% met een uitgesproken afdronk. Hop en alcohol zorgen ervoor dat dit stevig en stabiel maar ook doordrinkbaar is.'
        },
        'Rolducker Zwaere': {
            name: 'Rolducker Zwaere',
            description: 'Gebrouwen met honing van onze kloosterbijen die zich het hele seizoen tegoed doen aan de heerlijke bloemen rond de abdij. De honing zorgt voor een zoete noot die het aroma van ons bier helemaal rond maakt. Deze Rolducker Zwaere vertoeft graag in het gezelschap van een rijpe oude creamy kaas of pittig gerijpte smaakvolle kaasfondue. Geboren als winterbier maar inmiddels groter dan één seizoen geworden.'
        },
        'Duuvels Weizen': {
            name: 'Duuvels Weizen',
            description: '"Waar God is, kan de duivel niet zijn" zegt men. Op Abdij Rolduc echter, waar Pater en Non leven, heeft Lucifer toch zijn kop opgestoken. Maar een beetje ondeugd kan leiden tot iets goeds! Perfect in evenwicht tussen de zachte smaken van tarwe en de fruitige hop is onze Duuvels Weizen. Heerlijk verfrissend en vol van smaak: Goed en Kwaad hebben samen iets moois gebouwd!'
        },
        'Zondig Genot': {
            name: 'Zondig Genot',
            description: 'Adam en Eva maakten de fout om van de verboden appels te eten. Maar hadden ze geweten dat buiten het paradijs van appels Calvados gemaakt wordt, hadden zij hun exodus beslist veel eerder gemaakt! Geniet van een heerlijk donker bier, vol van smaak aangevuld met de heerlijke smaken van de toegevoegde Calvados.'
        },
        'Blonde Non Barrel Aged': {
            name: 'Blonde Non Barrel Aged',
            description: 'Onze Blonde Non gerijpt op Frans eiken cognac-vaten. Een complexe barrel-aged Belgian Strong Golden Ale met de zachte vanille- en eikenhouttonen van de cognacvaten gecombineerd met de bloemige en fruitige karakteristieken van het originele bier.'
        }
    };

    // Create and add modal to the page if it doesn't exist
    function createBeerModal() {
        if (document.getElementById('beer-info-modal-homepage')) return;
        
        const modal = document.createElement('div');
        modal.id = 'beer-info-modal-homepage';
        modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 id="modal-beer-name-homepage" class="text-2xl font-bold text-green-dark"></h2>
                        <button id="close-modal-homepage" class="text-gray-500 hover:text-gray-700 text-2xl">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="modal-beer-content-homepage" class="text-gray-700 leading-relaxed">
                        <!-- Beer info content will be inserted here -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = document.getElementById('close-modal-homepage');
        closeBtn.addEventListener('click', closeBeerModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBeerModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeBeerModal();
            }
        });
    }

    function openBeerModal(beerName) {
        createBeerModal();
        const modal = document.getElementById('beer-info-modal-homepage');
        const modalName = document.getElementById('modal-beer-name-homepage');
        const modalContent = document.getElementById('modal-beer-content-homepage');
        
        if (beerInfoData[beerName]) {
            modalName.textContent = beerInfoData[beerName].name;
            modalContent.innerHTML = `<p class="text-lg leading-relaxed">${beerInfoData[beerName].description}</p>`;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeBeerModal() {
        const modal = document.getElementById('beer-info-modal-homepage');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // Transform carousel beer cards to add "Meer Info" functionality
    function addBeerInfoButtons() {
        const carouselCards = document.querySelectorAll('#beer-carousel .beer-card');
        
        carouselCards.forEach(card => {
            const nameElement = card.querySelector('h3');
            const orderButton = card.querySelector('a[href="webshop.html"], button');
            
            if (nameElement && orderButton) {
                const beerName = nameElement.textContent.trim();
                
                // Skip if this is a liqueur or special edition without detailed info needed
                if (beerName.includes('Duivelsrit') || beerName.includes('Hellevuur') || 
                    beerName.includes('Gulden Buit') || beerName.includes('Schijproces') ||
                    beerName.includes('Vrome Tinus') || beerName.includes('Sjwatse Madonna')) {
                    return; // Skip liqueurs and limited editions that only have proeflokaal access
                }
                
                if (beerInfoData[beerName]) {
                    const buttonContainer = orderButton.parentElement;                        // Check if info button already exists
                        if (!buttonContainer.querySelector('.beer-info-btn-carousel')) {
                            // Find price element
                            const priceElement = buttonContainer.querySelector('.beer-price');
                            
                            if (priceElement) {
                                // Create a flex container for price and info button
                                const priceRow = document.createElement('div');
                                priceRow.className = 'flex justify-between items-center mb-2';
                                
                                // Create info button
                                const infoButton = document.createElement('button');
                                infoButton.className = 'beer-info-btn-carousel text-green-main text-sm hover:text-green-dark transition-colors underline';
                                infoButton.innerHTML = '<i class="fas fa-info-circle mr-1"></i>Meer Info';
                                infoButton.addEventListener('click', function(e) {
                                    e.preventDefault();
                                    openBeerModal(beerName);
                                });
                                
                                // Move price to new container and add info button
                                priceRow.appendChild(priceElement.cloneNode(true));
                                priceRow.appendChild(infoButton);
                                
                                // Replace original price with new container
                                buttonContainer.insertBefore(priceRow, priceElement);
                                buttonContainer.removeChild(priceElement);
                            }
                        }
                }
            }
        });
    }

    // Initialize beer info functionality
    addBeerInfoButtons();
    
    // Re-add buttons when carousel changes (if needed)
    if (carousel) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    addBeerInfoButtons();
                }
            });
        });
        observer.observe(carousel, { childList: true, subtree: true });
    }

    // ...existing code...

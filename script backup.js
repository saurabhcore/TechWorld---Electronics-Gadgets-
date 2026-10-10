/* TechWorld storefront — complete, self-contained frontend logic */
'use strict';
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const products = [
{id:1,brand:'Apple',name:'iPhone 16',category:'Mobiles',price:69999,old:79999,rating:4.8,reviews:1240,badge:'Bestseller',badgeType:'hot',image:'phone-blue.webp',visual:'visual-phone',subtitle:'A18 chip · Advanced camera',specs:['128 GB','OLED display','5G']},
{id:2,brand:'Samsung',name:'Galaxy S24',category:'Mobiles',price:59999,old:69999,rating:4.7,reviews:984,badge:'Popular',badgeType:'',image:'phone-purple.webp',visual:'visual-phone',subtitle:'Dynamic AMOLED · Galaxy AI',specs:['256 GB','AMOLED','5G']},
{id:3,brand:'OnePlus',name:'13 5G',category:'Mobiles',price:69999,old:79999,rating:4.8,reviews:762,badge:'Top rated',badgeType:'',image:'phone-oneplus.webp',visual:'visual-phone',subtitle:'Flagship performance · Fast charging',specs:['256 GB','120 Hz','5G']},
{id:4,brand:'Samsung',name:'Galaxy A55',category:'Mobiles',price:28999,old:34999,rating:4.5,reviews:540,badge:'Great value',badgeType:'',image:'phone-purple.webp',visual:'visual-phone',subtitle:'Bright display · All-day battery',specs:['128 GB','AMOLED','5G']},
{id:5,brand:'Dell',name:'Inspiron 14',category:'Laptops',price:62999,old:72999,rating:4.6,reviews:433,badge:'Work essential',badgeType:'',image:'laptop-dell.webp',visual:'visual-laptop',subtitle:'Portable laptop for work and study',specs:['Core i5','16 GB RAM','512 GB SSD']},
{id:6,brand:'Apple',name:'MacBook Air',category:'Laptops',price:89999,old:99999,rating:4.9,reviews:1103,badge:'Bestseller',badgeType:'hot',image:'laptop-ultrabook.webp',visual:'visual-laptop',subtitle:'Lightweight · Powerful · Silent',specs:['M-series chip','16 GB RAM','All-day battery']},
{id:7,brand:'HP',name:'Pavilion 14',category:'Laptops',price:62999,old:69999,rating:4.6,reviews:321,badge:'Save ₹7,000',badgeType:'',image:'laptop-silver.webp',visual:'visual-laptop',subtitle:'Everyday productivity in style',specs:['Core i5','16 GB RAM','512 GB SSD']},
{id:8,brand:'ASUS',name:'ROG Gaming Laptop',category:'Gaming',price:89999,old:104999,rating:4.8,reviews:671,badge:'Gaming pick',badgeType:'hot',image:'gaming-laptop.webp',visual:'visual-laptop',subtitle:'High-performance gaming machine',specs:['RTX graphics','144 Hz','RGB keyboard']},
{id:9,brand:'Sony',name:'Wireless Headphones',category:'Audio',price:4999,old:6999,rating:4.6,reviews:842,badge:'Fan favourite',badgeType:'',image:'headphones-black.webp',visual:'visual-audio',subtitle:'Immersive sound · Comfortable fit',specs:['Wireless','Noise isolation','Long battery']},
{id:10,brand:'JBL',name:'Tune Earbuds',category:'Audio',price:1999,old:2999,rating:4.5,reviews:1390,badge:'Best value',badgeType:'',image:'earbuds-jbl.webp',visual:'visual-audio',subtitle:'Compact earbuds with punchy sound',specs:['Bluetooth','Pocket case','Clear calls']},
{id:11,brand:'boAt',name:'Airdopes',category:'Audio',price:1499,old:2499,rating:4.4,reviews:1850,badge:'Hot deal',badgeType:'hot',image:'earbuds-white.webp',visual:'visual-audio',subtitle:'Everyday wireless audio',specs:['Wireless','Touch controls','Compact case']},
{id:12,brand:'JBL',name:'Portable Speaker',category:'Audio',price:2499,old:3499,rating:4.5,reviews:632,badge:'Portable sound',badgeType:'',image:'speaker-black.webp',visual:'visual-audio',subtitle:'Take your music anywhere',specs:['Bluetooth','Portable','Rich sound']},
{id:13,brand:'Apple',name:'Watch Series',category:'Wearables',price:29999,old:34999,rating:4.8,reviews:702,badge:'Smart choice',badgeType:'',image:'smartwatch-apple.webp',visual:'visual-watch',subtitle:'Health insights and daily activity',specs:['Fitness tracking','Notifications','Water resistant']},
{id:14,brand:'boAt',name:'Storm Smartwatch',category:'Wearables',price:1999,old:2999,rating:4.3,reviews:1190,badge:'Value pick',badgeType:'',image:'smartwatch-black.webp',visual:'visual-watch',subtitle:'Everyday fitness on your wrist',specs:['Activity tracking','Smart alerts','Colour display']},
{id:15,brand:'Logitech',name:'MX Wireless Mouse',category:'Accessories',price:2499,old:3499,rating:4.6,reviews:512,badge:'Work smarter',badgeType:'',image:'mouse-mx.webp',visual:'visual-accessory',subtitle:'Precision and comfort for work',specs:['Wireless','Ergonomic','Multi-device']},
{id:16,brand:'Logitech',name:'Wireless Mouse',category:'Accessories',price:799,old:1199,rating:4.3,reviews:986,badge:'Everyday essential',badgeType:'',image:'mouse-black.webp',visual:'visual-accessory',subtitle:'Simple, reliable everyday control',specs:['Wireless','Plug and play','Compact']},
{id:17,brand:'Razer',name:'BlackWidow Mini',category:'Gaming',price:8999,old:10999,rating:4.7,reviews:405,badge:'Gamer favourite',badgeType:'hot',image:'keyboard-rgb.webp',visual:'visual-accessory',subtitle:'Compact mechanical gaming keyboard',specs:['RGB lighting','Mechanical','Compact layout']},
{id:18,brand:'Logitech',name:'G502 Hero Mouse',category:'Gaming',price:3999,old:4999,rating:4.7,reviews:654,badge:'Precision pick',badgeType:'',image:'mouse-black.webp',visual:'visual-accessory',subtitle:'Accurate control for gaming',specs:['High precision','Programmable','Ergonomic']},
{id:19,brand:'ASUS',name:'ROG Gaming Headset',category:'Gaming',price:5999,old:7499,rating:4.6,reviews:318,badge:'Immersive audio',badgeType:'',image:'headphones-black.webp',visual:'visual-audio',subtitle:'Comfortable headset for long sessions',specs:['Surround audio','Over-ear','Gaming mic']},
{id:20,brand:'TP-Link',name:'Tapo Smart Plug',category:'Smart Home',price:999,old:1499,rating:4.4,reviews:732,badge:'Smart living',badgeType:'',image:'smart-plug-tp-link.webp',visual:'visual-smart-home',subtitle:'Smart control for compatible appliances',specs:['App control','Scheduling','Compact design']},
{id:21,brand:'Amazon',name:'Echo Dot Smart Speaker',category:'Smart Home',price:4499,old:5499,rating:4.6,reviews:1632,badge:'Bestseller',badgeType:'hot',image:'echo-smart-speaker.webp',visual:'visual-smart-home',subtitle:'Compact smart speaker with voice assistant',specs:['Voice control','Room-filling sound','Smart home hub']},
{id:22,brand:'Xiaomi',name:'Smart Security Camera',category:'Smart Home',price:2499,old:3299,rating:4.5,reviews:897,badge:'Home security',badgeType:'',image:'security-camera-xiaomi.webp',visual:'visual-smart-home',subtitle:'Keep an eye on your home',specs:['Live monitoring','Night vision*','Mobile app']},
{id:23,brand:'Apple',name:'iPad Air',category:'Tablets',price:59999,old:64999,rating:4.8,reviews:504,badge:'Creative essential',badgeType:'',image:'tablet-color.webp',visual:'visual-tablet',subtitle:'Big-screen productivity and creativity',specs:['High-resolution display','Lightweight','All-day use']},
{id:24,brand:'Lenovo',name:'Tab M11',category:'Tablets',price:17999,old:21999,rating:4.4,reviews:386,badge:'Great value',badgeType:'',image:'tablet-color.webp',visual:'visual-tablet',subtitle:'Entertainment and everyday tasks',specs:['Large display','Stereo sound','Portable']},
{id:25,brand:'Microsoft',name:'Xbox Controller',category:'Gaming',price:4999,old:5999,rating:4.7,reviews:478,badge:'Play more',badgeType:'',image:'gaming-console.webp',visual:'visual-accessory',subtitle:'Comfortable controller for gaming',specs:['Wireless capable','Ergonomic','Responsive controls']}
];
const state={category:'All',brand:'All',search:'',sort:'featured',cart:{},wishlist:new Set()};
const imageFor=p=>p.image;
function discount(p){return Math.max(0,Math.round((1-p.price/p.old)*100));}
function toast(message){const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600);}
function updateCounts(){const count=Object.values(state.cart).reduce((a,b)=>a+b,0);$('#cartCount').textContent=count;$('#drawerCount').textContent=`(${count})` ;$('#wishCount').textContent=state.wishlist.size;}
function filteredProducts(){let list=products.filter(p=>(state.category==='All'||(state.category==='Offers'?discount(p)>=15:p.category===state.category))&&(state.brand==='All'||p.brand.toLowerCase()===state.brand.toLowerCase())&&(`${p.name} ${p.brand} ${p.category} ${p.subtitle} ${p.specs.join(' ')}`.toLowerCase().includes(state.search.toLowerCase())));if(state.sort==='price-low')list.sort((a,b)=>a.price-b.price);if(state.sort==='price-high')list.sort((a,b)=>b.price-a.price);if(state.sort==='rating')list.sort((a,b)=>b.rating-a.rating);return list;}
function renderProducts(){const grid=$('#productGrid');if(!grid)return;const list=filteredProducts();grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-visual ${p.visual}"><span class="product-badge ${p.badgeType}">${p.badge}</span><button class="wishlist-btn ${state.wishlist.has(p.id)?'active':''}" data-wish="${p.id}" aria-label="${state.wishlist.has(p.id)?'Remove from':'Add to'} wishlist">${state.wishlist.has(p.id)?'♥':'♡'}</button><img src="${imageFor(p)}" alt="${p.brand} ${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/500x400/f3f5f8/26354a?text=TechWorld'"></div><div class="product-info"><div class="product-brand">${p.category} · ${p.brand}</div><h3 class="product-title">${p.brand} ${p.name}</h3><div class="product-subtitle">${p.subtitle}</div><div class="rating"><span class="stars">★★★★★</span><span class="rating-number">${p.rating} (${p.reviews.toLocaleString('en-IN')})</span></div><div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span><span class="discount">${discount(p)}% OFF</span></div><div class="specs">${p.specs.map((s,i)=>`<span>${['▣','▤','◉'][i%3]} ${s}</span>`).join('')}</div><button class="add-cart" data-add="${p.id}">🛒 &nbsp; Add to Cart</button></div></article>`).join('');$('#emptyState').hidden=!!list.length;grid.hidden=!list.length;updateCounts();}
function setCategory(cat){state.category=cat;state.brand='All';$$('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category===cat));$$('#filterTabs button').forEach(b=>b.classList.toggle('active',b.dataset.category===cat));renderProducts();if(cat!=='All')$('#featured')?.scrollIntoView({behavior:'smooth',block:'start'});}
function addToCart(id){const p=products.find(x=>x.id===Number(id));if(!p)return;state.cart[id]=(state.cart[id]||0)+1;renderCart();toast(`${p.name} added to cart`);}
function renderCart(){const entries=Object.entries(state.cart);const cartItems=$('#cartItems');if(!cartItems)return;cartItems.innerHTML=entries.length?entries.map(([id,qty])=>{const p=products.find(x=>x.id===Number(id));return `<div class="cart-item"><img src="${imageFor(p)}" alt="${p.brand} ${p.name}"><div><h4>${p.brand} ${p.name}</h4><small>${p.subtitle}</small><div class="quantity-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button><button class="remove-item" data-remove="${id}">Remove</button></div></div><div class="cart-item-price">${money(p.price*qty)}</div></div>`}).join(''):'<div class="cart-empty"><span>🛒</span><b>Your cart is waiting for something good.</b><p>Add a few favourites to get started.</p></div>';const total=entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0);$('#cartSubtotal').textContent=money(total);$('#demoTotal').textContent=money(total);$('#checkoutBtn').disabled=!entries.length;$('#checkoutBtn').style.opacity=entries.length?'1':'.5';updateCounts();}
function openCart(){renderCart();$('#overlay').classList.add('show');$('#cartDrawer').classList.add('open');document.body.style.overflow='hidden';}
function closeCart(){ $('#cartDrawer').classList.remove('open');if(!$('#checkoutModal').classList.contains('open'))$('#overlay').classList.remove('show');document.body.style.overflow='';}
function openCheckout(){if(!Object.keys(state.cart).length){toast('Your cart is empty');return;}const total=Object.entries(state.cart).reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0);$('#demoTotal').textContent=money(total);$('#checkoutModal').classList.add('open');$('#overlay').classList.add('show');document.body.style.overflow='hidden';}
function closeCheckout(){ $('#checkoutModal').classList.remove('open');$('#overlay').classList.remove('show');document.body.style.overflow='';}
function showWishlist(){const ids=[...state.wishlist];if(!ids.length){toast('Your wishlist is empty');return;}state.category='All';state.brand='All';state.search='';$('#searchInput').value='';const grid=$('#productGrid');grid.innerHTML=products.filter(p=>ids.includes(p.id)).map(p=>`<article class="product-card"><div class="product-visual ${p.visual}"><span class="product-badge">Wishlist</span><button class="wishlist-btn active" data-wish="${p.id}" aria-label="Remove from wishlist">♥</button><img src="${imageFor(p)}" alt="${p.brand} ${p.name}"></div><div class="product-info"><div class="product-brand">${p.category} · ${p.brand}</div><h3 class="product-title">${p.brand} ${p.name}</h3><div class="product-subtitle">${p.subtitle}</div><div class="price-row"><span class="price">${money(p.price)}</span></div><button class="add-cart" data-add="${p.id}">🛒 &nbsp; Add to Cart</button></div></article>`).join('');$('#emptyState').hidden=true;grid.hidden=false;$('#featured').scrollIntoView({behavior:'smooth'});}
function setupEvents(){
 $('#searchForm').addEventListener('submit',e=>{e.preventDefault();state.search=$('#searchInput').value.trim();renderProducts();$('#featured').scrollIntoView({behavior:'smooth'});});$('#searchInput').addEventListener('input',e=>{state.search=e.target.value.trim();renderProducts();});
 document.addEventListener('click',e=>{const cat=e.target.closest('[data-category]');if(cat){setCategory(cat.dataset.category);return;}const brand=e.target.closest('[data-brand]');if(brand){state.brand=brand.dataset.brand;state.category='All';$$('#filterTabs button').forEach(b=>b.classList.toggle('active',b.dataset.category==='All'));renderProducts();$('#featured').scrollIntoView({behavior:'smooth'});return;}const add=e.target.closest('[data-add]');if(add){addToCart(add.dataset.add);return;}const wish=e.target.closest('[data-wish]');if(wish){const id=Number(wish.dataset.wish);state.wishlist.has(id)?state.wishlist.delete(id):state.wishlist.add(id);renderProducts();toast(state.wishlist.has(id)?'Added to wishlist':'Removed from wishlist');return;}const qty=e.target.closest('[data-qty]');if(qty){const id=Number(qty.dataset.qty);state.cart[id]=(state.cart[id]||0)+Number(qty.dataset.delta);if(state.cart[id]<=0)delete state.cart[id];renderCart();return;}const remove=e.target.closest('[data-remove]');if(remove){delete state.cart[Number(remove.dataset.remove)];renderCart();return;}});
 $('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;renderProducts();});$('#cartTop').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);$('#overlay').addEventListener('click',()=>{closeCart();closeCheckout();});$('#checkoutBtn').addEventListener('click',openCheckout);$('#closeCheckout').addEventListener('click',closeCheckout);
 $('#placeDemoOrder').addEventListener('click',()=>{if(!Object.keys(state.cart).length){closeCheckout();toast('Your cart is empty');return;}state.cart={};renderCart();closeCheckout();toast('Demo order placed successfully — no payment taken');});$('#wishlistTop').addEventListener('click',showWishlist);$('#clearFilters').addEventListener('click',()=>{state.category='All';state.brand='All';state.search='';$('#searchInput').value='';renderProducts();});$('#viewAll').addEventListener('click',()=>setCategory('All'));$('#accountBtn').addEventListener('click',()=>toast('Account sign-in is a demo feature'));$('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();const email=e.currentTarget.querySelector('input[type=email]');if(!email.checkValidity()){email.reportValidity();return;}toast(`Thanks for subscribing, ${email.value}! (demo)`);e.currentTarget.reset();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeCheckout();}});
 // Make non-button support/navigation controls interactive with helpful demo messages.
 $$('.utility-right span').forEach((el,i)=>{el.tabIndex=0;el.style.cursor='pointer';const action=()=>toast(['Order tracking is a demo feature','Need help? Contact support: support@techworld.demo','Prices shown in Indian rupees (INR)'][i]||'TechWorld demo');el.addEventListener('click',action);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action();}});});
 $$('.footer-main a[href="#top"]').forEach(a=>{if(/Contact|Track order|Returns|FAQs|Careers|Privacy|Terms|Our story/i.test(a.textContent)){a.addEventListener('click',e=>{e.preventDefault();toast(`${a.textContent.trim()} — demo information page`);});}});
 $$('.socials span').forEach(el=>{el.tabIndex=0;el.style.cursor='pointer';el.addEventListener('click',()=>toast('Social links are placeholders in this demo'));});
}
function initHero(){const hero=$('.hero');if(!hero)return;const prev=hero.querySelector('.hero-prev'),next=hero.querySelector('.hero-next'),dots=[...hero.querySelectorAll('.hero-dots span')],heading=hero.querySelector('.hero-copy h1'),paragraph=hero.querySelector('.hero-copy > p');const images={laptop:hero.querySelector('.hero-laptop img'),phone:hero.querySelector('.hero-phone img'),headphones:hero.querySelector('.hero-headphones img'),watch:hero.querySelector('.hero-watch img')};const original={heading:heading.innerHTML,paragraph:paragraph.textContent,images:Object.fromEntries(Object.entries(images).map(([k,img])=>[k,img?.src]))};const slides=[original,{heading:'Power Up Your <span>Everyday.</span>',paragraph:'Discover smart upgrades, powerful performance and everyday tech essentials.',images:{laptop:'laptop-dell.webp',phone:'phone-oneplus.webp',headphones:'headphones-black.webp',watch:'smartwatch-apple.webp'}},{heading:'Smarter Living Starts <span>Here.</span>',paragraph:'Bring comfort, convenience and control home with smart technology.',images:{laptop:'laptop-ultrabook.webp',phone:'phone-blue.webp',headphones:'echo-smart-speaker.webp',watch:'security-camera-xiaomi.webp'}}];let active=0,timer;function show(i){active=(i+slides.length)%slides.length;const s=slides[active];heading.innerHTML=s.heading;paragraph.textContent=s.paragraph;Object.entries(images).forEach(([k,img])=>{if(img&&s.images[k])img.src=s.images[k];});dots.forEach((d,j)=>{d.classList.toggle('active',j===active);d.setAttribute('role','button');d.setAttribute('tabindex','0');d.setAttribute('aria-label',`Show banner ${j+1}`);});}function restart(){clearInterval(timer);timer=setInterval(()=>show(active+1),6500);}prev?.addEventListener('click',()=>{show(active-1);restart();});next?.addEventListener('click',()=>{show(active+1);restart();});dots.forEach((d,i)=>{d.style.cursor='pointer';d.addEventListener('click',()=>{show(i);restart();});d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i);restart();}});});show(0);restart();}
document.addEventListener('DOMContentLoaded',()=>{setupEvents();renderProducts();renderCart();initHero();console.info('TechWorld ready — demo storefront, no real payments.');});
// TechWorld Professional Support
(() => {
    const modal = document.getElementById("supportModal");

    if (!modal || modal.dataset.initialized === "true") return;
    modal.dataset.initialized = "true";

    const title = document.getElementById("supportTitle");
    const description = document.getElementById("supportDescription");
    const trackForm = document.getElementById("trackOrderForm");
    const helpOptions = document.getElementById("helpOptions");
    const orderResult = document.getElementById("orderResult");
    const orderInput = document.getElementById("supportOrderId");

    function openSupport(mode) {
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        orderResult.hidden = true;

        if (mode === "track") {
            title.textContent = "Track Your Order";
            description.textContent =
                "Enter your TechWorld order ID to check the demo tracking status.";
            trackForm.hidden = false;
            helpOptions.hidden = true;
            orderInput.value = "";
            setTimeout(() => orderInput.focus(), 50);
        } else {
            title.textContent = "TechWorld Help & Support";
            description.textContent = "Choose a topic. We’ll guide you through the next step.";
            trackForm.hidden = true;
            helpOptions.hidden = false;
        }
    }

    function closeSupport() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    document.getElementById("trackOrderBtn")
        ?.addEventListener("click", () => openSupport("track"));

    document.getElementById("helpBtn")
        ?.addEventListener("click", () => openSupport("help"));

    document.getElementById("closeSupport")
        ?.addEventListener("click", closeSupport);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeSupport();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeSupport();
    });

    document.getElementById("checkOrderBtn")
        ?.addEventListener("click", () => {
            const orderId = orderInput.value.trim();

            if (!orderId) {
                orderResult.textContent = "Please enter an Order ID.";
                orderResult.hidden = false;
                return;
            }

            orderResult.textContent =
                `Order ID: ${orderId}. This is a demo storefront; live order status is not connected.`;
            orderResult.hidden = false;
        });

    helpOptions.addEventListener("click", event => {
        const button = event.target.closest("[data-help]");
        if (!button) return;

        const messages = {
            delivery: "Order & Delivery: Live delivery information is not connected in this demo.",
            returns: "Returns & Refunds: This demo does not process real returns or refunds.",
            product: "Product Support: Please refer to the product details shown on the TechWorld storefront.",
            contact: "Contact Support: Add your official support email address here when available."
        };

        description.textContent = messages[button.dataset.help] || "Please select a support topic.";
        helpOptions.hidden = true;

        const backButton = document.createElement("button");
        backButton.type = "button";
        backButton.className = "support-primary";
        backButton.textContent = "Back to Support Options";
        backButton.id = "backToSupport";

        orderResult.replaceChildren(backButton);
        orderResult.hidden = false;

        backButton.addEventListener("click", () => {
            orderResult.hidden = true;
            helpOptions.hidden = false;
            description.textContent = "Choose a topic. We’ll guide you through the next step.";
        });
    });
})();
// Fix: Track Order popup
document.getElementById("trackOrderBtn")?.addEventListener("click", function () {
    const orderId = prompt("Enter your TechWorld Order ID:");

    if (orderId && orderId.trim()) {
        alert(
            "TechWorld Order Tracking\n\n" +
            "Order ID: " + orderId.trim() +
            "\n\nDemo mode: Order tracking is simulated."
        );
    }
});

// Fix: Help popup
document.getElementById("helpBtn")?.addEventListener("click", function () {
    alert(
        "TechWorld Help & Support\n\n" +
        "• Order and delivery assistance\n" +
        "• Returns and refunds\n" +
        "• Product-related queries\n\n" +
        "This is a demo support feature."
    );
});
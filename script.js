document.addEventListener('DOMContentLoaded', function () {
    const navbarHamburger = document.querySelector('.navbarhamburger');
    const ulMenu = document.querySelector('.ulmenu');

    navbarHamburger.addEventListener('click', function () {
        ulMenu.classList.toggle('show-menu');
    });

    const sidebar = document.getElementById('sidebar');
    const cartIcon = document.querySelector('.fa-solid.fa-cart-shopping');
    const closeSidebarButton = document.getElementById('closeSidebar');

    cartIcon.addEventListener('click', function () {
        sidebar.classList.add('show');
    });

    closeSidebarButton.addEventListener('click', function () {
        sidebar.classList.remove('show');
    });
    
    AOS.init();
});

let currentIndex = 0;
let interval;

const showSlide = (index) => {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const slideWidth = slides[0].clientWidth;
    currentIndex = (index + slides.length) % slides.length;
    slider.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
};

const autoplay = () => {
    interval = setInterval(() => showSlide(currentIndex + 1), 3500);
};

const stopAutoplay = () => clearInterval(interval);

const changeSlide = (direction) => {
    stopAutoplay();
    showSlide(currentIndex + direction);
};

autoplay();

let listproduct = document.querySelector("#userlist");
fetch("db.json")
    .then(response => response.json())
    .then(db => {
        db.products.forEach(product => {
            let dom = document.createElement('li');

            if (product.image) {
                let img = document.createElement('img');
                img.src = product.image;
                img.alt = product.name || 'No Name';
                dom.appendChild(img);

                let button = document.createElement('button');
                button.className = 'quickview'; 
                button.textContent = 'Quick View';
                dom.appendChild(button);
            } else {
                console.error('Image URL is undefined for:', product);
            }

            if (product.name) {
                let name = document.createElement('p');
                name.textContent = `Name: ${product.name}`;
                dom.appendChild(name);
            } else {
                console.error('Name is undefined for:', product);
                return;
            }

            if (product.price) {
                let price = document.createElement('p');
                price.textContent = `Price: $${product.price.toFixed(2)}`;
                dom.appendChild(price);
            } else {
                console.error('Price is undefined for:', product);
                return;
            }

            listproduct.appendChild(dom);

            const quickviewbutton = listproduct.getElementsByClassName("quickview");
            quickviewbutton[quickviewbutton.length - 1].addEventListener("click", (e) => { 
                e.preventDefault();
                const modal = document.createElement("div");
                modal.className = "view-card";
                modal.innerHTML = `
                    <div class="products-images">
                        <img src=${product.image} alt="">
                        <img src=${product.image} alt="">
                        <img src=${product.image} alt="">
                    </div>
                    <div class="product-slider">
                        <div class="product-slides">
                            <div class="product-slide" style="background-image: url(${product.image});"></div>
                            <div class="product-slide" style="background-image: url(${product.image});"></div>
                            <div class="product-slide" style="background-image: url(${product.image});"></div>
                        </div>
                    </div>
                    <div class="product-infos" data-id="${product.id}">
                <i class="fa-solid fa-x close-card"></i>
                         <h2>${product.image}</h2>
                          <h3>${product.name}</h3>
                          <p>$${product.price}</p>
                     <div class="buttons1"><button>-</button><span>1</span><button>+</button></div>
                        <button class="add-to-card">ADD TO CARD</button>
                        <button class="add-wishlist">ADD TO WISHLIST</button>
                `;

                const closeButton=document.getElementsByClassName("close-card")
               
                document.body.appendChild(modal);
                        closeButton[0].addEventListener("click",(e)=>{
                            e.preventDefault()
                            const parentElement=e.target.parentElement.parentElement
                            parentElement.remove()
                        })
                        const addToCardButton=document.getElementsByClassName("add-to-card")
                        const addToWishButton=document.querySelectorAll(".add-wishlist")
                addBasket(addToCardButton[0])
                addToWishButton[0].addEventListener("click",(e)=>{
                    const card=e.target.closest(".product-infos")
                    const product={
               id:card.dataset.id,
               image:card.querySelector("h2").innerText,
               name:card.querySelector("h3").innerText,
            price:card.querySelector("p").innerText.replace("$",""),
              quantity:card.querySelector("span").innerText
           }
          
           addToWishlist1(product)   
           })   
           })
            });
        })
    .catch(error => {
        console.error('Error:', error);
    });





function addBasket(addToCardButton) {
    addToCardButton.addEventListener("click",(e)=>{
        e.preventDefault()
        const parentElement = e.target.parentNode;
        const product={
            id:parentElement.dataset.id,
            image:parentElement.querySelector("h2").innerText,
            name:parentElement.querySelector("h3").innerText,
            price:parentElement.querySelector("p").innerText.replace("$",""),
            quantity:parentElement.querySelector("span").innerText
        }
        addToBasket(product)
    })
}
function addToBasket(addproduct){
    let cart=JSON.parse(localStorage.getItem("basket")) || []
    const existingProduct=cart.findIndex((product)=>product.id===addproduct.id)
    if (existingProduct>-1) {
        alert("daxil edilib")
    }
    else{
        cart.push(addproduct)
    }
    localStorage.setItem("basket",JSON.stringify(cart))
    basketadding()
    updateCount()
}
function basketadding() {
    const cart=JSON.parse(localStorage.getItem("basket")) || []
    const elements=document.querySelector(".basket-items")
    elements.innerHTML=``
    cart.forEach((product)=>{
        const elementsdiv=document.createElement("div")
        elementsdiv.dataset.id=product.id
        elementsdiv.className="basketing-item"
        elementsdiv.innerHTML=`<img class="cartImage" src=${product.image} alt="">${product.name}-${product.quantity}-x${(product.quantity*product.price).toFixed(2)}<i class="fa-solid fa-trash delete-product" data-id="${product.id}"></i>`
        elements.appendChild(elementsdiv)
    })
    const totalPrice=cart.reduce((toplam,item)=>toplam+item.price*item.quantity,0)
    document.getElementById("total").textContent=totalPrice.toFixed(2)
    const deleteProduct=document.querySelectorAll(".delete-product")
        deleteProduct.forEach(delPro=>{
            delPro.addEventListener("click",(e)=>{
                const productId=e.target.dataset.id
                RemoveProduct(productId)
            })
        })
}
function RemoveProduct(productID) {
    console.log(productID);
    const cart=JSON.parse(localStorage.getItem("basket")) || []
    const updateCart=cart.filter(item=>item.id !==productID)

    localStorage.setItem("basket",JSON.stringify(updateCart))
    updateCount()
    basketadding()
}
function updateCount() {
    const cart=JSON.parse(localStorage.getItem("basket")) || []
    const say=cart.reduce((toplam,item)=>toplam+=parseInt(item.quantity),0)
    document.getElementById("say").innerHTML=``
    document.getElementById("say").innerText=say
}
updateCount()
basketadding()



function addToWishlist1(data) {
    let wishlist=JSON.parse(localStorage.getItem("wishlist")) || []
    const existingProduct=wishlist.findIndex((product)=>product.id===data.id)
    if (existingProduct>-1) {
        alert("daxil edilib")
    }
    else{
        wishlist.push(data)
        localStorage.setItem("wishlist",JSON.stringify(wishlist))
    }
    DisplayWishlist()  
}

function DisplayWishlist() {
    let wishlist=JSON.parse(localStorage.getItem("wishlist")) || []
    const wishlistItems=document.getElementById("wishlist-items")
    wishlistItems.innerHTML=''
    wishlist.forEach((product)=>{
        const productElement=document.createElement("div")
        productElement.className="wish-product"
        productElement.innerHTML=`<div class="card123" >
        <img src=${product.image} alt="Mercedes">
        <h3>${product.title}</h3>
        <p>${product.price}</p>
        <button class="add-to-cart">Add to cart</button>
        <i class="fa-solid fa-trash remove-to-wishlist" data-id=${product.id}></i>
    </div>`
    wishlistItems.appendChild(productElement)
// updateWishCount()

})
wishlistItems.querySelectorAll(".add-to-cart").forEach((button, index) => {
    button.addEventListener("click", () => {
        const product = wishlist[index];
        addToBasket({
            id: product.id,
            image: product.image,
            name: product.name,
            price: parseFloat(product.price), 
            quantity: 1
        });
        basketadding()
    });
})
    
    document.querySelectorAll(".remove-to-wishlist").forEach(button=>{
        button.addEventListener("click",(e)=>{
            const productId=e.target.dataset.id
            removeFromWishlist(productId)
        })
    })
   }

// const addtocartbutton = listproduct.getElementsByClassName("add-to-card");

// Array.from(addtocartbutton).forEach(button => {
//     button.addEventListener("click", (e) => {
//         e.preventDefault();

//         const product = {
//             name: e.target.parentElement.querySelector('h2').textContent,
//             price: e.target.parentElement.querySelector('p').textContent,
//             image: e.target.parentElement.parentElement.querySelector('img').src
//         };

//         updateCart(product);
//         sidebar.classList.add('show');
//     });
// });

// function updateCart(product) {
   

//     const cartList = document.querySelector("#sidebar .cart-list");

//     const cartItem = document.createElement('div');
//     cartItem.className = 'cart-item';
//     cartItem.innerHTML = `
//         <img src="${product.image}" alt="${product.name}">
//         <div class="product-info">
//             <h3>${product.name}</h3>
//             <p>${product.price}</p>
//         </div>
//     `;

//     cartList.appendChild(cartItem);
// }
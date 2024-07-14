document.addEventListener('DOMContentLoaded', () => {
  const products = document.querySelectorAll('.product');
  const cartContainer = document.querySelector('.cart');
  const orderList = document.getElementById('order-list');
  const cartEmpty = document.getElementById('cart-empty');
  const cartLabel = document.getElementById('cart-label');
  const carbonNeutral = document.getElementById('carbon-neutral');
  const confirmBtn = document.getElementById('confirmation-btn');
  const grandTotalElem = document.getElementById('grand-total');
  const cartCountElem = document.querySelector('.cart h2');
  const orderConfirmation = document.getElementById('order-confirmation');
  const orderSummary = document.getElementById('order-summary');
  const summaryGrandTotalElem = document.getElementById('summary-grand-total');
  const newOrderBtn = document.getElementById('new-order');

  let cart = [];
  let cartCount = 0;
  let grandTotal = 0;

  function updateCartUI() {
      cartCountElem.textContent = `Your Cart (${cartCount})`;
      grandTotalElem.textContent = `$${grandTotal.toFixed(2)}`;

      if (cart.length > 0) {
          cartEmpty.style.display = 'none';
          cartLabel.style.display = 'none';
          carbonNeutral.style.display = 'block';
          confirmBtn.style.display = 'block';
          orderList.style.display = 'block';
          document.querySelector('.total-box').style.display = 'flex';
      } else {
          cartEmpty.style.display = 'block';
          cartLabel.style.display = 'block';
          carbonNeutral.style.display = 'none';
          confirmBtn.style.display = 'none';
          orderList.style.display = 'none';
          document.querySelector('.total-box').style.display = 'none';
      }

      orderList.innerHTML = '';

      cart.forEach(item => {
          const listItem = document.createElement('div');
          listItem.classList.add('list-item');

          const firstClmn = document.createElement('div');
          firstClmn.classList.add('first-clmn');

          const orderItemName = document.createElement('span');
          orderItemName.id = 'order-item-name';
          orderItemName.textContent = item.name;

          const listFlex = document.createElement('div');
          listFlex.classList.add('list-flex');

          const orderListQty = document.createElement('span');
          orderListQty.id = 'order-list-qty';
          orderListQty.textContent = `${item.quantity}×`;

          const orderItemPrice = document.createElement('span');
          orderItemPrice.id = 'order-item-price';
          orderItemPrice.textContent = `@$${item.price.toFixed(2)}`;

          const orderItemTotalPrice = document.createElement('span');
          orderItemTotalPrice.id = 'order-item-total-price';
          orderItemTotalPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

          listFlex.append(orderListQty, orderItemPrice, orderItemTotalPrice);
          firstClmn.append(orderItemName, listFlex);

          const orderCancel = document.createElement('span');
          orderCancel.id = 'order-cancel';
          orderCancel.textContent = '×';

          orderCancel.addEventListener('click', () => {
              removeFromCart(item.id);
          });

          listItem.append(firstClmn, orderCancel);
          orderList.appendChild(listItem);
      });
  }

  function addToCart(productElem, productId, productName, productPrice) {
      const itemPic = productElem.querySelector('.item-pic');
      const addCartBtn = productElem.querySelector('#add-cart');
      const addCartReplaceBtn = productElem.querySelector('#add-cart-replace');
      const btnQtyElem = productElem.querySelector('#btn-qty');
      const minusBtn = productElem.querySelector('#minus');
      const plusBtn = productElem.querySelector('#plus');

      let quantity = 1;

      addCartBtn.classList.add('hidden');
      addCartReplaceBtn.classList.remove('hidden');
      itemPic.style.border = '2px solid hsl(14, 86%, 42%)';
      itemPic.style.borderRadius = '8px';

      btnQtyElem.textContent = quantity;

      const cartItem = {
          id: productId,
          name: productName,
          price: parseFloat(productPrice.replace('$', '')),
          quantity: quantity,
      };

      cart.push(cartItem);
      cartCount += 1;
      grandTotal += cartItem.price;

      updateCartUI();

      plusBtn.addEventListener('click', () => {
          cartItem.quantity += 1;
          btnQtyElem.textContent = cartItem.quantity;
          cartCount += 1;
          grandTotal += cartItem.price;
          updateCartUI();
      });

      minusBtn.addEventListener('click', () => {
          if (cartItem.quantity > 1) {
              cartItem.quantity -= 1;
              btnQtyElem.textContent = cartItem.quantity;
              cartCount -= 1;
              grandTotal -= cartItem.price;
              updateCartUI();
          } else {
              removeFromCart(cartItem.id);
          }
      });
  }

  function removeFromCart(productId) {
      const productElem = document.getElementById(productId);
      const itemPic = productElem.querySelector('.item-pic');
      const addCartBtn = productElem.querySelector('#add-cart');
      const addCartReplaceBtn = productElem.querySelector('#add-cart-replace');

      const cartItem = cart.find(item => item.id === productId);

      cartCount -= cartItem.quantity;
      grandTotal -= cartItem.price * cartItem.quantity;

      cart = cart.filter(item => item.id !== productId);

      addCartBtn.classList.remove('hidden');
      addCartReplaceBtn.classList.add('hidden');
      itemPic.style.border = 'none';

      updateCartUI();
  }

  confirmBtn.addEventListener('click', () => {
    orderConfirmation.classList.remove('hidden');
    orderConfirmation.style.display = 'flex';
    window.scrollTo(0, 0);

    orderSummary.innerHTML = '';

    cart.forEach(item => {
        const summaryBox = document.createElement('div');
        summaryBox.classList.add('summary-box');

        const summaryImg = document.createElement('img');
        summaryImg.id = 'summary-image-product';
        summaryImg.src = document.getElementById(`${item.id}-img`).querySelector('img').src;
        summaryImg.alt = item.name;

        const summaryClmn = document.createElement('div');
        summaryClmn.classList.add('summary-clmn');

        const summaryItemName = document.createElement('span');
        summaryItemName.id = 'summary-item-name';
        summaryItemName.textContent = item.name;

        const summaryFlex = document.createElement('div');
        summaryFlex.classList.add('summary-flex');

        const summaryNum = document.createElement('span');
        summaryNum.id = 'summary-num';
        summaryNum.textContent = `${item.quantity}×`;

        const summaryAmount = document.createElement('span');
        summaryAmount.id = 'summary-amount';
        summaryAmount.textContent = `@$${item.price.toFixed(2)}`;

        summaryFlex.append(summaryNum, summaryAmount);

        summaryClmn.append(summaryItemName, summaryFlex);

        const summaryItemTotal = document.createElement('span');
        summaryItemTotal.id = 'summary-item-total';
        summaryItemTotal.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        summaryBox.append(summaryImg, summaryClmn, summaryItemTotal);
        orderSummary.appendChild(summaryBox);
    });

    summaryGrandTotalElem.textContent = `$${grandTotal.toFixed(2)}`;
});

  newOrderBtn.addEventListener('click', () => {
      cart = [];
      cartCount = 0;
      grandTotal = 0;
      updateCartUI();
      orderConfirmation.classList.add('hidden');
      orderConfirmation.style.display = 'none';
      location.reload();
      window.scrollTo(0, 0);
  });

  products.forEach(product => {
      const addCartBtn = product.querySelector('#add-cart');
      const productId = product.id;
      const productName = product.querySelector('#second-name').textContent;
      const productPrice = product.querySelector('#price').textContent;

      addCartBtn.addEventListener('click', () => {
          addToCart(product, productId, productName, productPrice);
      });
  });
});

import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

type BasketItem = {
  product: Product
  quantity: number
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortTerm, setSortTerm] = useState<string>("AtoZ");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [basketItems, setBasketItems] = useState<BasketItem[]>(itemList.map((item) => {
    return {
      product: item,
      quantity: 0,
    }
  }));

  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm, sortTerm, inStockOnly]);

  useEffect(() => {

  }, [sortTerm])

  // ===== Basket management =====
  function showBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'block';
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById('shopping-area');
    if (areaObject !== null) {
      areaObject.style.display = 'none';
    }
  }

  function handleBasket(id: number, isAdd: boolean) {
    setBasketItems((prev) => {
      const newItems = prev.map(item => {
        if (item.product.id === id) {
          return { ...item, quantity: isAdd ? item.quantity + 1 : item.quantity - 1 }; // Create a new object with incremented quantity
        }
        return item;
      });
      return newItems;
    });
  }

  function calculateTotal() {
    const total = basketItems.reduce((acc, item) => {
      return acc + (item.quantity * item.product.price);
    }, 0);
    return total.toFixed(2);  // Ensures the total is a string with two decimal places
  }

  // ===== Search =====
  function updateSearchedProducts() {
    let holderList: Product[] = itemList;

    let filteredProducts = holderList.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
      && (!inStockOnly || product.quantity > 0)
    );

    let sortedProducts = filteredProducts.sort((a, b) => {
      switch (sortTerm) {
        case 'AtoZ':
          return a.name.localeCompare(b.name);
        case 'ZtoA':
          return b.name.localeCompare(a.name);
        case '£LtoH':
          return a.price - b.price;
        case '£HtoL':
          return b.price - a.price;
        case '*LtoH':
          return a.rating - b.rating;
        case '*HtoL':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setSearchedProducts(sortedProducts);
  }

  // ===== Search indicator =====
  function resultsIndicator() {
    const n = searchedProducts.length;
    const st = searchTerm;
    if (st === '') {
      if (n > 1) {
        return n + "Products"
      } else return "1Product"
    } else {
      if (n > 1) {
        return n + "Results"
      } else if (n === 1) {
        return "1Result"
      } else {
        return "Nosearchresultsfound"
      }
    }
  }

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/Assets/Logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img id="shopping-icon" onClick={showBasket} src="./src/Assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>x</p>
          </div>
          {basketItems.filter((item) => item.quantity > 0).map((item) => (
            <div key={item.product.id} className='shopping-row'>
              <div className='shopping-information'>
                <p>{item.product.name}({item.product.price}) - {item.quantity}</p>
              </div><button onClick={() => handleBasket(item.product.id, false)}>Remove</button>
            </div>
          ))}

          <p>{!basketItems.some(item => item.quantity > 0) ? 'Your basket is empty' : `Total: ${calculateTotal()}`}</p>
        </div>
      </div>
      <div id="search-bar">
        <input type="text" placeholder="Search..." onChange={changeEventObject => setSearchTerm(changeEventObject.target.value)}></input>
        <div id="control-area">
          <select onChange={(e) => setSortTerm(e.target.value)}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input id="inStock" type="checkbox" onChange={(e) => setInStockOnly(e.target.checked)}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{resultsIndicator()}</p>
      <ProductList itemList={searchedProducts} addToBasket={(id) => handleBasket(id, true)} />
    </div>
  )
}

export default App

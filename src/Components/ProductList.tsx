type ContentAreaProps = {
	itemList: Product[]
	addToBasket: (id: number) => void
}

type Product = {
	id: number
	name: string
	price: number
	category: string
	quantity: number
	rating: number
	image_link: string
}

export const ProductList = (props: ContentAreaProps) => {
	return (
		<div id="productList">
			{props.itemList.map((item) => {
				return (
					<div key={item.name} className="product">
						<div className="product-top-bar">
							<h2>{item.name}</h2>
							<p> £{item.price.toFixed(2)} ({item.rating}/5)</p>
						</div>
						<img src={"./src/Assets/Product_Images/" + item.image_link}></img>
						{item.quantity > 0 ? (
							<button value={item.id} onClick={() => props.addToBasket(item.id)}>Add to basket</button>
						) : (
							<button disabled={true}>Out of Stock</button>
						)}
					</div>
				)
			})}
		</div>
	)
}
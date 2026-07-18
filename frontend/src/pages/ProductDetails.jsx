import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/products/${id}`)
            .then((res) => setProduct(res.data))
            .catch(console.error);
    }, [id]);

    if (!product) return <h2>Loading...</h2>;

    return (
    <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
            Product Details
        </h1>

        {/* Basic Information */}

        <div className="bg-card rounded-xl p-6 border border-border mb-8">

            <h2 className="text-xl font-semibold mb-6">
                Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-6">

                <div>
                    <label className="text-sm text-textMuted">Product Name</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        {product.productName}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-textMuted">SKU Code</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        {product.sku}
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="text-sm text-textMuted">Description</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border min-h-24">
                        {product.description}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-textMuted">Category</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        {product.category}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-textMuted">Supplier</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        {product.supplier}
                    </div>
                </div>

            </div>

        </div>

        {/* Pricing */}

        <div className="bg-card rounded-xl p-6 border border-border">

            <h2 className="text-xl font-semibold mb-6">
                Pricing & Inventory
            </h2>

            <div className="grid grid-cols-4 gap-6">

                <div>
                    <label className="text-sm text-textMuted">Purchase Price</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        ₹ {product.purchasePrice}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-textMuted">Selling Price</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        ₹ {product.sellingPrice}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-textMuted">Opening Quantity</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        {product.openingQuantity}
                    </div>
                </div>

                <div>
                    <label className="text-sm text-textMuted">Minimum Stock</label>
                    <div className="mt-2 p-3 rounded-lg bg-background border">
                        {product.minimumStockLevel}
                    </div>
                </div>

            </div>

        </div>

    </div>
);
}

export default ProductDetails;


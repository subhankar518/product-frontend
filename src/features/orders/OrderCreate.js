import React, { useState } from "react";
import api from "../../api/axios";

export default function OrderCreate() {
    const [items, setItems] = useState([{ productId: "", quantity: 1 }]);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState(null);

    const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
    const updateItem = (idx, key, val) => {
        const copy = items.slice();
        copy[idx] = { ...copy[idx], [key]: val };
        setItems(copy);
    };
    const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

    const submit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setMessage(null);
        try {
            const payload = {
                items: items.map((i) => ({
                    productId: Number(i.productId),
                    quantity: Number(i.quantity),
                })),
            };
            const { data } = await api.post(
                "/api/v1/orders/create-order",
                payload
            );
            setMessage(
                "Order placed successfully. Order ID: " +
                    (data?.data?.order?.id || "")
            );
            setItems([{ productId: "", quantity: 1 }]);
        } catch (err) {
            setMessage(err.response?.data?.message || err.message);
        } finally {
            setStatus("idle");
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h3 className="mb-3">Place Order</h3>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={submit}>
                    {items.map((row, idx) => (
                        <div className="row g-2 align-items-end mb-2" key={idx}>
                            <div className="col-md-6">
                                <label className="form-label">Product ID</label>
                                <input
                                    className="form-control"
                                    value={row.productId}
                                    onChange={(e) =>
                                        updateItem(
                                            idx,
                                            "productId",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={row.quantity}
                                    onChange={(e) =>
                                        updateItem(
                                            idx,
                                            "quantity",
                                            e.target.value
                                        )
                                    }
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeItem(idx)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mb-2">
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={addItem}
                        >
                            Add Item
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={status === "loading"}
                        >
                            {status === "loading"
                                ? "Placing..."
                                : "Place Order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

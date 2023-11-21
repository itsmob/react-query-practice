import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct, updateProduct } from '../api/products.api';

export default function Products() {
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: products,
    isError,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (products) => products.sort((a, b) => b.id - a.id),
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      console.log('Product deleted');
      queryClient.invalidateQueries('products');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      console.log('Product updated');
      queryClient.invalidateQueries('products');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  return (
    <>
      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <div>{product.description}</div>
          <div>{product.price}</div>
          <button onClick={() => deleteProductMutation.mutate(product.id)}>Delete</button>
          <input
            checked={product.inStock}
            id={product.id}
            type='checkbox'
            onChange={(e) =>
              updateProductMutation.mutate({
                ...product,
                inStock: e.target.checked,
              })
            }
          />
          <label htmlFor={product.id}>In Stock</label>
        </div>
      ))}
    </>
  );
}

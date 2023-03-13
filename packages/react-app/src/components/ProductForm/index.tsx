import React, { useMemo, useState } from 'react';
import cn from 'classnames';

import { ProductType } from 'types/product';

import backgroundImage from 'assets/ProductFormBackImage.png';
import CustomButton from 'components/CustomButton';

import './styles.scss';

type ProductFormType = {
  product?: ProductType,
  isEdit?: boolean,
  handleSave: (product: Partial<ProductType>) => void,
}

const ProductForm = ({
  product,
  isEdit = false,
  handleSave,
} : ProductFormType) => {
  const {
    name = '',
    description = '',
    price = 0,
    image = '',
  } = product || {};

  const [productName, setProductName] = useState<string>(name);
  const [productDescription, setProductDescription] = useState<string>(description);
  const [productPrice, setProductPrice] = useState<number>(price);
  const [productImage, setProductImage] = useState<string>(image);
  const [zoomImage, setZoomImage] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentProduct = {
      name: productName,
      description: productDescription,
      price: productPrice,
      image: productImage,
    };

    handleSave(currentProduct);
  };

  const convertBase64 = (file: File) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const b64File = await convertBase64(file);

      setProductImage((b64File as string).replace(/data:image\/\w+;base64,/g, ''));
    }
  };

  const disabledForm = useMemo(
    () => !productName || !productDescription || !productPrice || !productImage,
    [productName, productDescription, productPrice, productImage],
  );

  const buttonLabel = isEdit ? 'Save Changes' : 'Publish New Item';
  const formTitle = isEdit ? 'Edit Item' : 'New Item';

  return (
    <div className="product-form">
      <div className="product-form__title">{formTitle}</div>
      <img className="product-form__image" src={backgroundImage} alt="Background" />
      <form onSubmit={handleSubmit}>
        <div className="product-form__content">
          <div className="product-form__input-value-container">
            <p>Item name</p>
            <input
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
            />
          </div>
          <div className="product-form__input-value-container">
            <p>Item description</p>
            {/* eslint-disable-next-line react/self-closing-comp */}
            <textarea
              onChange={(e) => setProductDescription(e.target.value)}
              value={productDescription}
            >
            </textarea>
          </div>
          <div className="product-form__input-value-container">
            <p>Price</p>
            <input
              onChange={(e) => setProductPrice(parseInt(e.target.value.slice(1), 10) || 0)}
              value={`$${productPrice}`}
            />
          </div>
          <div className="product-form__input-value-container">
            <p>Image</p>
            {productImage && (
              <img
                className={cn('product-form__preview-image', { 'product-form__preview-image-zoom': zoomImage })}
                src={`data:image/jpeg;base64,${productImage}`}
                alt={productName || 'New Image'}
                onMouseEnter={() => setZoomImage(true)}
                onMouseLeave={() => setZoomImage(false)}
              />
            )}
            <input
              className="product-form__input-image"
              type="file"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="product-form__button">
          <CustomButton
            disabled={disabledForm}
            text={buttonLabel}
          />
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

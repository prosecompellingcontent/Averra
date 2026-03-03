import { useNavigate } from 'react-router';
import { useCart } from '@/app/context/CartContext';
import { CartPreviewPopup } from '@/app/components/CartPreviewPopup';

export function CartPreviewWrapper() {
  const navigate = useNavigate();
  const { items, showPreview, setShowPreview } = useCart();

  return (
    <CartPreviewPopup
      items={items}
      isVisible={showPreview}
      onClose={() => setShowPreview(false)}
      onNavigateToCart={() => navigate('/cart')}
    />
  );
}

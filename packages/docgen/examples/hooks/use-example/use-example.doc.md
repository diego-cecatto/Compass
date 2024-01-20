# Use Example

Hook to show a useExample in a console.log

## Usage

```tsx
import useExample from 'hooks/useExample';

function MyComponent() {
    const showMessage = useExample();

    React.useEffect(() => {
        showMessage();
    }, []);
}
```

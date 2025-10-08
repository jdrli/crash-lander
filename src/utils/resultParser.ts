export type TestResult = {
  name: string;
  value: string | number | boolean | undefined;
  status: string; // 'PASS' or 'FAIL'
  type: string; // 'diagnostic' or 'test'
  category?: string; // For diagnostics: 'categories', 'diagnostics', or 'metrics'
};

export type ParsedResults = {
  diagnostics: TestResult[];
  tests: TestResult[];
};

// Function to determine if a value represents a pass or fail status
const determineStatus = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? 'PASS' : 'FAIL';
  }
  if (typeof value === 'number') {
    // Assuming scores above 0.7 (70%) are passes
    return value >= 0.7 ? 'PASS' : 'FAIL';
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'pass' || value.toLowerCase() === 'true' || value !== 'fail' ? 'PASS' : 'FAIL';
  }
  return value ? 'PASS' : 'FAIL';
};

// Function to categorize diagnostics
const categorizeDiagnostic = (name: string): string => {
  // Common Lighthouse category names
  const categories = [
    'performance',
    'accessibility', 
    'best-practices',
    'seo',
    'pwa'
  ];
  
  // Common Lighthouse diagnostic names
  const diagnostics = [
    'first-contentful-paint',
    'largest-contentful-paint', 
    'first-input-delay',
    'cumulative-layout-shift',
    'speed-index',
    'total-blocking-time'
  ];
  
  // Common Lighthouse metric names
  const metrics = [
    'performance-score',
    'accessibility-score',
    'best-practices-score', 
    'seo-score',
    'pwa-score'
  ];
  
  if (categories.includes(name.toLowerCase())) {
    return 'categories';
  } else if (diagnostics.some(d => name.toLowerCase().includes(d) || d.includes(name.toLowerCase()))) {
    return 'diagnostics';
  } else if (metrics.includes(name.toLowerCase()) || name.toLowerCase().includes('score')) {
    return 'metrics';
  }
  
  // Default to diagnostics if it seems like a diagnostic metric
  if (name.toLowerCase().includes('audit') || name.toLowerCase().includes('metric') || name.toLowerCase().includes('score')) {
    return 'diagnostics';
  }
  
  return 'diagnostics'; // Default category
};

export const parseResults = (apiResults: any): ParsedResults => {
  const diagnostics: TestResult[] = [];
  const tests: TestResult[] = [];
  
  // Handle different possible formats of the API response
  let resultsArray: any[] = [];
  
  if (!apiResults) {
    // If apiResults is null or undefined, return empty results
    return { diagnostics, tests };
  } else if (Array.isArray(apiResults)) {
    resultsArray = apiResults;
  } else if (typeof apiResults === 'object' && Array.isArray(apiResults.results)) {
    // If apiResults is an object with a results array (like the full API response)
    resultsArray = apiResults.results;
  } else if (typeof apiResults === 'object') {
    // If it's an object with individual results, try to make an array from it
    resultsArray = [apiResults];
  } else {
    // If it's neither an array nor an object, return empty results
    return { diagnostics, tests };
  }
  
  resultsArray.forEach(result => {
    const resultType = result.type ? result.type.toLowerCase() : '';
    
    if (resultType.includes('lighthouse') || resultType.includes('diagnostic') || resultType.includes('performance')) {
      // Handle Lighthouse results specifically - only add to diagnostics
      if (result.result && typeof result.result === 'object' && result.result.categories) {
        // This is a Lighthouse result - only extract the four main categories
        const lighthouseResult = result.result;
        
        // Process only the four main categories: performance, accessibility, best-practices, seo
        if (lighthouseResult.categories) {
          const allowedCategories = ['performance', 'accessibility', 'best-practices', 'seo'];
          
          Object.entries(lighthouseResult.categories).forEach(([categoryName, categoryData]: [string, any]) => {
            if (allowedCategories.includes(categoryName)) {
              // Format the category name properly
              let displayName = categoryName;
              if (categoryName === 'best-practices') displayName = 'Best Practices';
              else if (categoryName === 'seo') displayName = 'SEO';
              else if (categoryName === 'pwa') displayName = 'PWA'; // In case PWA appears somehow
              else displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
              
              diagnostics.push({
                name: displayName,
                value: categoryData && typeof categoryData === 'object' ? categoryData.score : categoryData,
                status: determineStatus(categoryData && typeof categoryData === 'object' ? categoryData.score : categoryData),
                type: 'diagnostic',
                category: 'categories'
              });
            }
          });
        }
      } else {
        // Handle any other diagnostic results that don't fit the Lighthouse format
        if (Array.isArray(result.result)) {
          // If result is an array of diagnostic items
          result.result.forEach((item: any) => {
            if (typeof item === 'object' && item !== null) {
              const name = item.name || item.title || item.id || 'Unknown Diagnostic';
              const value = item.score !== undefined ? item.score : 
                           item.value !== undefined ? item.value : 
                           item.rawValue !== undefined ? item.rawValue : 
                           item.displayValue !== undefined ? item.displayValue : 
                           item.message !== undefined ? item.message : 
                           (typeof item === 'object' ? 
                            (item.title || item.id || item.name || item.message || JSON.stringify(item)) : 
                            String(item));
              const status = item.status || determineStatus(item.score !== undefined ? item.score : item.value);
              const category = categorizeDiagnostic(name);
              
              diagnostics.push({
                name,
                value,
                status,
                type: 'diagnostic',
                category
              });
            } else {
              // Handle primitive values
              diagnostics.push({
                name: `Diagnostic ${diagnostics.length + 1}`,
                value: item,
                status: determineStatus(item),
                type: 'diagnostic',
                category: 'diagnostics'
              });
            }
          });
        } else if (result.result && typeof result.result === 'object') {
          // If result is an object with diagnostic properties
          Object.entries(result.result).forEach(([key, value]) => {
            const category = categorizeDiagnostic(key);
            diagnostics.push({
              name: key,
              value: typeof value === 'object' && value !== null && !Array.isArray(value)
                ? (('score' in value && value.score !== undefined) ? value.score as (string | number | boolean) : 
                   ('value' in value && value.value !== undefined) ? value.value as (string | number | boolean) : 
                   ('status' in value && value.status !== undefined) ? value.status as (string | number | boolean) : 
                   ('message' in value && value.message !== undefined) ? value.message as (string | number | boolean) : 
                   String(value))
                : (value as string | number | boolean | undefined),
              status: determineStatus(value),
              type: 'diagnostic',
              category
            });
          });
        } else {
          // Handle other formats
          diagnostics.push({
            name: result.type || 'Diagnostic',
            value: typeof result.result === 'object' && result.result !== null && !Array.isArray(result.result)
              ? (('score' in result.result && result.result.score !== undefined) ? result.result.score as (string | number | boolean) : 
                 ('value' in result.result && result.result.value !== undefined) ? result.result.value as (string | number | boolean) : 
                 ('status' in result.result && result.result.status !== undefined) ? result.result.status as (string | number | boolean) : 
                 ('message' in result.result && result.result.message !== undefined) ? result.result.message as (string | number | boolean) : 
                 String(result.result))
              : (result.result as string | number | boolean | undefined),
            status: result.status || determineStatus(result.result),
            type: 'diagnostic',
            category: 'diagnostics'
          });
        }
      }
    } else if (resultType.includes('playwright') || resultType.includes('test') || resultType.includes('e2e')) {
      // Handle Playwright test results
      if (Array.isArray(result.result)) {
        // If result is an array of test items
        result.result.forEach((item: any) => {
          if (typeof item === 'object' && item !== null) {
            const name = item.name || item.test || item.title || 'Unknown Test';
            const value = item.detail !== undefined ? item.detail : 
                         item.message !== undefined ? item.message : 
                         item.status !== undefined ? item.status : 
                         (typeof item === 'object' ? 
                          (item.title || item.id || item.name || item.message || JSON.stringify(item)) : 
                          String(item));
            const status = item.status || determineStatus(item.passed !== undefined ? item.passed : item.value);
            
            tests.push({
              name,
              value,
              status,
              type: 'test'
            });
          } else {
            // Handle primitive values
            tests.push({
              name: `Test ${tests.length + 1}`,
              value: item,
              status: determineStatus(item),
              type: 'test'
            });
          }
        });
      } else if (result.result && typeof result.result === 'object') {
        // If result is an object with test properties
        Object.entries(result.result).forEach(([key, value]) => {
          tests.push({
            name: key,
            value: typeof value === 'object' && value !== null && !Array.isArray(value)
              ? (('score' in value && value.score !== undefined) ? value.score as (string | number | boolean) : 
                 ('value' in value && value.value !== undefined) ? value.value as (string | number | boolean) : 
                 ('status' in value && value.status !== undefined) ? value.status as (string | number | boolean) : 
                 ('message' in value && value.message !== undefined) ? value.message as (string | number | boolean) : 
                 String(value))
              : (value as string | number | boolean | undefined),
            status: determineStatus(value),
            type: 'test'
          });
        });
      } else {
        // Handle other formats
        tests.push({
          name: result.type || 'Test',
          value: typeof result.result === 'object' && result.result !== null && !Array.isArray(result.result)
            ? ('score' in result.result ? result.result.score : 
               'value' in result.result ? result.result.value : 
               'status' in result.result ? result.result.status : 
               'message' in result.result ? result.result.message : 
               String(result.result))
            : (result.result as string | number | boolean | undefined),
          status: result.status || determineStatus(result.result),
          type: 'test'
        });
      }
    } else {
      // Default behavior - try to categorize based on content
      if (Array.isArray(result.result)) {
        result.result.forEach((item: any) => {
          const name = typeof item === 'object' && item.name ? item.name : `Result ${result.result.indexOf(item) + 1}`;
          const value = typeof item === 'object' ? 
                       (item.value !== undefined ? item.value : 
                        item.score !== undefined ? item.score : 
                        item.message !== undefined ? item.message : 
                        item.title !== undefined ? item.title : 
                        JSON.stringify(item)) : 
                       item;
          const status = typeof item === 'object' && item.status ? item.status : determineStatus(value);
          
          // Try to determine if it's more likely a diagnostic or test
          const isDiagnostic = name.toLowerCase().includes('audit') || 
                              name.toLowerCase().includes('metric') || 
                              name.toLowerCase().includes('score') ||
                              resultType.includes('lighthouse') ||
                              resultType.includes('performance');
                              
          if (isDiagnostic) {
            const category = categorizeDiagnostic(name);
            diagnostics.push({
              name,
              value,
              status,
              type: 'diagnostic',
              category
            });
          } else {
            tests.push({
              name,
              value,
              status,
              type: 'test'
            });
          }
        });
      } else {
        // For single results, determine type based on common patterns
        const isDiagnostic = resultType.includes('lighthouse') || 
                            resultType.includes('performance') || 
                            resultType.includes('audit') || 
                            resultType.includes('metric') ||
                            resultType.includes('score');
                            
        if (isDiagnostic) {
          const category = categorizeDiagnostic(result.type || 'diagnostic');
          diagnostics.push({
            name: result.type || 'Diagnostic',
            value: typeof result.result === 'object' && result.result !== null && !Array.isArray(result.result)
              ? (('score' in result.result && result.result.score !== undefined) ? result.result.score as (string | number | boolean) : 
                 ('value' in result.result && result.result.value !== undefined) ? result.result.value as (string | number | boolean) : 
                 ('status' in result.result && result.result.status !== undefined) ? result.result.status as (string | number | boolean) : 
                 ('message' in result.result && result.result.message !== undefined) ? result.result.message as (string | number | boolean) : 
                 String(result.result))
              : (result.result as string | number | boolean | undefined),
            status: result.status || determineStatus(result.result),
            type: 'diagnostic',
            category
          });
        } else {
          tests.push({
            name: result.type || 'Test',
            value: typeof result.result === 'object' && result.result !== null && !Array.isArray(result.result)
              ? (('score' in result.result && result.result.score !== undefined) ? result.result.score as (string | number | boolean) : 
                 ('value' in result.result && result.result.value !== undefined) ? result.result.value as (string | number | boolean) : 
                 ('status' in result.result && result.result.status !== undefined) ? result.result.status as (string | number | boolean) : 
                 ('message' in result.result && result.result.message !== undefined) ? result.result.message as (string | number | boolean) : 
                 String(result.result))
              : (result.result as string | number | boolean | undefined),
            status: result.status || determineStatus(result.result),
            type: 'test'
          });
        }
      }
    }
  });
  
  return { diagnostics, tests };
};
require('../js/cint.js');
const T = (c, i) => console.log(JSON.stringify(CInterp.run(c, i)));
T(String.raw`#include <stdio.h>
#define N 5
void swap(int *a,int *b){int t=*a;*a=*b;*b=t;}
int fact(int n){return n<=1?1:n*fact(n-1);}
int main(){int a[N]={5,2,9,1,3};int n;float f=7/2;scanf("%d",&n);printf("n=%d %.2f %5.1f|%-4d|%04d\n",n,3.14159,f,7,42);
for(int i=0;i<N-1;i++)for(int j=0;j<N-1-i;j++)if(a[j]>a[j+1]){swap(&a[j],&a[j+1]);}
for(int i=0;i<N;i++)printf("%d ",a[i]);int m[2][3]={{1,2,3},{4,5,6}};printf("%d %d\n",m[1][2],fact(5));
char s[20]="Hello";printf("%s %d %c\n",s,(int)strlen(s),s[1]);
switch(n){case 42:printf("ok\n");break;default:printf("no\n");}
double d=10/4.0;printf("%.2f %d\n",d,(int)d);int k=0;while(1){k++;if(k>3)break;}printf("%d\n",k);return 0;}`, "42");

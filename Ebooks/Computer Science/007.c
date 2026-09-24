#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv)
{
    short values[] = {1, -2, 5, 3, -4, 8};
    printf("sizeof(values) = %lu\n", sizeof(values));
    printf("sizeof(values[0]) = %lu\n", sizeof(values[0]));
    return 0;
}

    
